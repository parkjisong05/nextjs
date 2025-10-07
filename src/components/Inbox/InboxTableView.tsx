'use client';
import React, { useState } from 'react'; 
import { InboxRow } from '@/types/inbox';
import Checkbox from '../form/input/Checkbox';
import { CiExport } from "react-icons/ci";
import { VscGraphLeft } from "react-icons/vsc";
import { HiOutlineRefresh } from "react-icons/hi";

interface InboxTableViewProps {
  rows: InboxRow[];
  selectRow: (row: InboxRow) => void;
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const InboxTableView: React.FC<InboxTableViewProps> = ({
  rows,
  selectRow,
  toggleSidebar,
  isSidebarCollapsed,
  isLoading,
  error,
  onRefresh,
}) => {
  // State for internal UI elements only
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedActions, setSelectedActions] = useState('การดำเนินการ');
  const [selectedLevel, setSelectedLevel] = useState('ระบุแล้ว');
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  // Helper functions for UI rendering
  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Assigned': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'reject': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (code: string) => {
    const priorityColors = {
      'PTM': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'AT6': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'APD': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[code as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800'}`}>
        {code}
      </span>
    );
  };

  const handleCheckboxChange = (rowId: number, checked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [rowId]: checked }));
  };

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const actionOptions = ['อนุมัติ', 'ปฏิเสธ', 'CANCEL', 'ระบุซ้ำ...', 'สร้างงานย่อย...', 'ยกระดับ', 'รีลีส', 'พักการทำงาน', 'เพิกถอน', 'ข้ามการระบุปัจจุบัน', 'เริ่มงาน'];
  const levelOptions = ['ไม่ระบุ', 'ระบุแล้ว', 'เสร็จสมบูรณ์', 'พักการทำงาน', 'เพิกถอนแล้ว', 'หมดอายุแล้ว', 'เกิดข้อผิดพลาด', 'มีการแจ้งเตือน', 'ส่งคำขอข้อมูลแล้ว'];

  const filteredRows = rows?.filter(row => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      row.topic?.toLowerCase().includes(searchLower) ||
      row.count?.toString().includes(searchLower) ||
      row.priority?.toString().includes(searchLower) ||
      row.summaryBy?.toLowerCase().includes(searchLower) ||
      row.statusText?.toLowerCase().includes(searchLower) ||
      row.postFixCode?.toLowerCase().includes(searchLower) ||
      row.team?.toLowerCase().includes(searchLower) ||
      row.createdAt?.toLowerCase().includes(searchLower) ||
      row.policyNo?.toLowerCase().includes(searchLower) ||
      row.insuredName?.toLowerCase().includes(searchLower)
    );
  }) || [];

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      {/* Toolbar */}
      <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center lg:justify-between p-2 bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800 space-y-4 lg:space-y-0 relative z-30">
        {/* Left Toolbar Section */}
        <div className="flex flex-wrap items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isSidebarCollapsed ? 'แสดง Sidebar' : 'ซ่อน Sidebar'}
          >
            ☰
          </button>
          
          {/* Actions Dropdown */}
          <div className="relative">
            <button onClick={() => toggleDropdown('actions')} className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
              <span>{selectedActions}</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {activeDropdown === 'actions' && ( <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-[9999] dark:bg-gray-800 dark:border-gray-700"> <div className="py-1 max-h-60 overflow-y-auto"> {actionOptions.map((option) => ( <button key={option} onClick={() => { setSelectedActions(option); setActiveDropdown(null); }} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"> {option} </button> ))} </div> </div> )}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-64 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg> </div>
            <input type="text" placeholder="ค้นหา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-custom focus:border-primary-custom dark:bg-gray-700 dark:border-gray-600" />
            {searchTerm && ( <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center" title="ล้างการค้นหา"> <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> </svg> </button> )}
          </div>

          {/* Level Dropdown */}
          <div className="relative">
            <button onClick={() => toggleDropdown('level')} className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
              <span>{selectedLevel}</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {activeDropdown === 'level' && ( <div className="absolute top-full left-0 mt-1 w-52 bg-white border rounded-md shadow-lg z-[9999] dark:bg-gray-800 dark:border-gray-700"> <div className="py-1 max-h-60 overflow-y-auto"> {levelOptions.map((option) => ( <button key={option} onClick={() => { setSelectedLevel(option); setActiveDropdown(null); }} className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${option === selectedLevel ? 'bg-blue-50 text-blue-600' : ''}`}> {option} </button> ))} </div> </div> )}
          </div>
          
          <button className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" title="Export"> <CiExport size={20} /> </button>
          <button className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" title="สถานะงาน"> <VscGraphLeft size={20} /> </button>
        </div>
        
        {/* Right Toolbar Section */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="รีเฟรชข้อมูล"
          >
            <HiOutlineRefresh size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 min-h-0 bg-white dark:bg-gray-900 overflow-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f9fafb' }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <HiOutlineRefresh size={32} className="animate-spin mr-3" />
            กำลังโหลดข้อมูล...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-center text-red-500">
            <div>
              <p className="font-semibold">เกิดข้อผิดพลาด</p>
              <p>{error}</p>
              <button onClick={onRefresh} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                ลองอีกครั้ง
              </button>
            </div>
          </div>
        ) : filteredRows.length > 0 ? (
          <div style={{ minWidth: '1800px' }} className="p-4">
            <table className="w-full text-sm">
              <thead className="bg-primary-custom dark:bg-primary-800-custom sticky top-0 z-10" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <tr>
                    <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '60px' }}>สถานะ</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ minWidth: '250px' }}>ชื่อ</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '100px' }}>Task No.</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '120px' }}>ลำดับสำคัญ</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '120px' }}>Assignees</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '100px' }}>สถานะ</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '120px' }}>รหัสสลักหลัง</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '80px' }}>ทีม</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '120px' }}>สร้างแล้ว</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '120px' }}>Acquired By</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '120px' }}>Assigned</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '150px' }}>หมายเลขกรมธรรม์</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ minWidth: '180px' }}>ชื่อผู้เอาประกัน</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '150px' }}>ผู้บันทึกสลักหลัง</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '120px' }}>ชื่อไฟล์</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '150px' }}>วันที่สร้างสลักหลัง</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '150px' }}>วันที่มีผลบังคับ</th>
                  <th className="px-4 py-3 text-left font-medium text-white whitespace-nowrap" style={{ width: '120px' }}>Process</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-4 py-3"><Checkbox checked={checkedItems[row.id] || false} onChange={(c) => handleCheckboxChange(row.id, c)} /></td>
                    <td className="px-4 py-3 cursor-pointer whitespace-nowrap" onClick={() => selectRow(row)}><span className="text-blue-600 underline hover:text-blue-800">{row.topic}</span></td>
                    <td className="px-4 py-3 text-blue-600 font-medium whitespace-nowrap">{row.count}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.priority}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.summaryBy}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(row.statusText)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{getPriorityBadge(row.postFixCode)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.team}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.createdAt}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.receivedBy}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.systemAt}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.policyNo}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.insuredName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.postMarkUser}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.fileName || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.endrCreateDate || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.endrEffectiveDate || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.edasDocStatus || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <div>
              <p className="text-lg mb-1 font-medium">ไม่พบข้อมูล</p>
              <p className="text-sm">
                {searchTerm ? `ไม่พบข้อมูลที่ตรงกับคำค้นหา "${searchTerm}"` : 'ยังไม่มีรายการงานในหมวดหมู่นี้'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dropdown Overlay */}
      {activeDropdown && (
        <div className="fixed inset-0 z-[9998]" onClick={() => setActiveDropdown(null)}></div>
      )}
    </div>
  );
};

export default InboxTableView;