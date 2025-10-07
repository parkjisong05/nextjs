'use client';
import React, { useState } from 'react';
import { InboxRow } from '@/types/inbox';
import Checkbox from '../form/input/Checkbox'; // สมมติว่าคุณมี component นี้อยู่
import { CiExport } from "react-icons/ci";
import { VscGraphLeft } from "react-icons/vsc";
import { HiOutlineRefresh } from "react-icons/hi";
import { useRouter } from "next/navigation";

interface InboxTableViewProps {
  rows: any[];
}

const InboxTableView: React.FC<InboxTableViewProps> = ({
  rows
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedActions, setSelectedActions] = useState('การดำเนินการ');
  const [selectedLevel, setSelectedLevel] = useState('ระบุแล้ว');
  const [searchTerm, setSearchTerm] = useState('');
  // state สำหรับการรีเฟรช
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = () => {
    if (isRefreshing) return; // ป้องกันการกดซ้ำ

    setIsRefreshing(true);
    console.log("กำลังรีเฟรชข้อมูล...");

    // ในแอปจริง คุณอาจจะเรียกฟังก์ชันที่ส่งมาจาก props เช่น props.onRefresh()
    // setTimeout นี้ใช้เพื่อจำลองการดึงข้อมูลจาก API
    setTimeout(() => {
      console.log("รีเฟรชข้อมูลสำเร็จ");
      setIsRefreshing(false);
    }, 1000); // จำลองว่าใช้เวลา 1 วินาที
  };

  // end of refresh
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

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const handleCheckboxChange = (rowId: number, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [rowId]: checked
    }));
  };

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const actionOptions = [
    'อนุมัติ', 'ปฏิเสธ', 'CANCEL', 'ระบุซ้ำ...', 'สร้างงานย่อย...', 'ยกระดับ', 'รีลีส',
    'พักการทำงาน', 'เพิกถอน', 'ข้ามการระบุปัจจุบัน', 'เริ่มงาน'
  ];

  const levelOptions = [
    'ไม่ระบุ', 'ระบุแล้ว', 'เสร็จสมบูรณ์', 'พักการทำงาน', 'เพิกถอนแล้ว',
    'หมดอายุแล้ว', 'เกิดข้อผิดพลาด', 'มีการแจ้งเตือน', 'ส่งคำขอข้อมูลแล้ว'
  ];

  const filteredRows = rows?.filter(row => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      row.id?.toLowerCase().includes(searchLower) ||
      row.A1?.toString().includes(searchLower) ||
      row.A2?.toString().includes(searchLower) ||
      row.A3?.toLowerCase().includes(searchLower) ||
      row.A4?.toLowerCase().includes(searchLower) ||
      row.A5?.toLowerCase().includes(searchLower) ||
      row.A6?.toLowerCase().includes(searchLower) ||
      row.A7?.toLowerCase().includes(searchLower) ||
      row.A8?.toLowerCase().includes(searchLower) 
    );
  }) || [];
   const router = useRouter();
  return (
    // Container หลักของ View: ใช้ flex-col เพื่อจัดเรียง Toolbar และ Table Container ในแนวตั้ง
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center lg:justify-between p-2 bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800 space-y-4 lg:space-y-0 relative z-30">
        {/* ส่วนซ้ายของ Toolbar */}
        <div className="flex flex-wrap items-center space-x-4 p-2 ">
          <span className='mr-2'>🔍</span> จัดการ Rules
        </div>

        {/* ส่วนขวาของ Toolbar   */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-primary-custom hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="รีเฟรชข้อมูล"
          >
            {/* ถ้ากำลังรีเฟรช ให้เพิ่ม class animate-spin */}
            <HiOutlineRefresh size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      {/* Table Container: ส่วนนี้จะยืดเต็มพื้นที่ที่เหลือและมี scroll bar ของตัวเอง */}
      <div className="flex-1 min-h-0 bg-white dark:bg-gray-900 overflow-auto p-4" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#d1d5db #f9fafb'
      }}>
        <div className="p-4">
        <div className="space-y-4">
          {/* Team */}
          <div className="flex justify-center items-center space-x-4">
            <label className="w-48 text-base font-medium text-right">
              Team :
            </label>
            <select
              className="h-12 w-[400px] px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">ALL</option>
              <option value="FPO1">FPO1</option>
              <option value="FPO2">FPO2</option>
              <option value="FPO3">FPO3</option>
              <option value="FPO4">FPO4</option>
              <option value="FPO5">FPO5</option>
              <option value="FPO6">FPO6</option>
              <option value="FPO7">FPO7</option>
              <option value="FPO8">FPO8</option>
              <option value="FPO9">FPO9</option>
              <option value="FPOT">FPOT</option>
              <option value="LSCT">LSCT</option>
              <option value="CHM">CHM</option>
              <option value="HAD">HAD</option>
              <option value="KHN">KHN</option>
              <option value="ILPT">ILPT</option>
              <option value="FPOI">FPOI</option>
            </select>
          </div>

          {/* ประเภทการแจกงาน */}
          <div className="flex justify-center items-center space-x-4">
            <label className="w-48 text-base font-medium text-right">
              ประเภทการแจกงาน :
            </label>
            <select
              className="h-12 w-[400px] px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">ALL</option>
              <option value="Round Robin">Round Robin</option>
              <option value="Pool">Pool</option>
              <option value="Specific">Specific</option>
            </select>
          </div>
          {/* สถานะ */}
          <div className="flex justify-center items-center space-x-4">
            <label className="w-48 text-base font-medium whitespace-nowrap text-right">
              สถานะ :
            </label>
            <div className="w-[400px] flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  className="form-radio text-primary focus:ring-primary"
                  defaultChecked
                />
                <span>Active</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  className="form-radio text-primary focus:ring-primary"
                />
                <span>Inactive</span>
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4 mt-6">
          <div className="flex justify-center space-x-2 text-center">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-custom text-white text-sm rounded hover:bg-primary-600">
            <span>🔍</span>
            <span>Search</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
            <span>❌</span>
            <span>Cancel</span>
          </button>

          </div>
        </div>
      </div>


        {filteredRows.length > 0 ? (
          <div style={{ minWidth: '1800px' }} className="p-4">
            <table className="w-full text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Sticky Header: จะติดอยู่ด้านบนเมื่อ scroll */}
              <thead
                className="bg-primary-custom dark:bg-primary-800-custom sticky top-0 z-10"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                <tr>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '120px' }}>ลำดับ</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '120px' }}>Team</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '100px' }}>ประเภทการแจกงาน</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '120px' }}>ลำดับทีม(แจกงาน)</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '80px' }}>สถานะใช้งาน</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '120px' }}>งานกระทบเบี้ย</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '120px' }}>งานไม่กระทบเบี้ย</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '120px' }}>งานต่ออายุ</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '150px' }}>งานกธ. สูญหาย</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '150px' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-center text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                      {row.id}
                    </td>
                     <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                      {row.A1}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                      {row.A2}
                    </td>
                    <td className="px-4 py-3  text-center text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                      {row.A3}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                      {row.A4}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                      {row.A5}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                      {row.A6}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                      {row.A7}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                      {row.A8}
                    </td>
                  <td
                      className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700"
                      style={{ width: '150px' }}
                    >
                      <div className="flex justify-center items-center space-x-2">
                        <button   onClick={() => router.push("/rules/edit")} className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
                          <span>🛠️</span>
                          <span>จัดการ</span>
                        </button>
                      </div>
                    </td>


                     </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-lg mb-2">ไม่พบข้อมูล</div>
              <div className="text-sm">
                {searchTerm ? `ไม่พบข้อมูลที่ค้นหา "${searchTerm}"` : 'ยังไม่มีรายการงาน'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay สำหรับปิด Dropdown เมื่อคลิกข้างนอก */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setActiveDropdown(null)}
        ></div>
      )}
    </div>
  );
};

export default InboxTableView;