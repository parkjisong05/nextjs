'use client';
import React, { useState } from 'react';
import { HiOutlineRefresh } from "react-icons/hi";
import DatePicker from '../form/date-picker';

interface InboxTableViewProps {
  rows: any[];
}

const InboxTableView: React.FC<InboxTableViewProps> = ({
  rows
}) => {
const [showPopup, setShowPopup] = useState(false);


const popupData = [
{ id: 1, fileName: 'CT_P15758501_0001_25680303_21515273_CTPS800126', policyNo: '21515273', status: 'นำเข้าไม่สำเร็จ', note: '' },
{ id: 2, fileName: 'CT_P25752158_0001_25680303_21515233_CTPS800126', policyNo: '21515233', status: 'นำเข้าไม่สำเร็จ', note: '' }
];
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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
  const filteredRows = rows?.filter(row => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      row.id?.toString().includes(searchLower) ||
      row.A1?.toString().includes(searchLower) ||
      row.A2?.toString().includes(searchLower) ||
      row.A3?.toLowerCase().includes(searchLower) ||
      row.A4?.toLowerCase().includes(searchLower) ||
      row.A5?.toLowerCase().includes(searchLower) 
    );
  }) || [];
  return (
    // Container หลักของ View: ใช้ flex-col เพื่อจัดเรียง Toolbar และ Table Container ในแนวตั้ง
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center lg:justify-between p-2 bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800 space-y-4 lg:space-y-0 relative z-30">
        {/* ส่วนซ้ายของ Toolbar */}
        <div className="flex flex-wrap items-center space-x-4 p-2 ">
          <span className='mr-2'>🔍</span> จัดการ Batch Monitoring
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
              System Date :
            </label>
            <div 
              className="h-12 w-[400px]"
          >
                    <DatePicker
                    id="date-picker"
                    placeholder="Select a date"
                    onChange={(date) => {
                    if (Array.isArray(date)) {
                      setSelectedDate(date[0]);
                    } else {
                      setSelectedDate(date);
                    }
                  }}
                    
                    />
                          
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
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '120px' }}>System Date Start</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '100px' }}>System Date End</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '120px' }}>ทั้งหมด</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '80px' }}>นำเข้าสำเร็จ</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '120px' }}>นำเข้าไม่สำเร็จ</th>
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
                     <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                      {row.A1}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                      {row.A2}
                    </td>
                    <td className="px-4 py-3  text-center text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                     <a href="#" className="text-blue-600 hover:underline" >
                    {row.A3}
                    </a>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                      <a href="#" className="text-blue-600 hover:underline" >
                    {row.A4}
                    </a>
                    </td>
                   <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                    <a href="#" className="text-blue-600 hover:underline px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" onClick={(e) => { e.preventDefault(); setShowPopup(true); }}>
                    {row.A5}
                    </a>
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

      {showPopup && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-[800px]">
            <h2 className="text-lg font-semibold mb-4">รายละเอียดการนำเข้าไม่สำเร็จ</h2>
            <table  className="w-full text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead  className="bg-primary-custom dark:bg-primary-800-custom sticky top-0 z-10">
            <tr>
            <th className="border  text-white whitespace-nowrap px-3 py-2 text-center">ลำดับ</th>
            <th className="border text-white whitespace-nowrap px-3 py-2">File Name</th>
            <th className="border text-white whitespace-nowrap px-3 py-2">Policy No</th>
            <th className="border text-white whitespace-nowrap px-3 py-2">สถานะ</th>
            <th className="border text-white whitespace-nowrap px-3 py-2">หมายเหตุ</th>
            </tr>
            </thead>
            <tbody>
            {popupData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
            <td className="border px-3 py-2 text-center">{item.id}</td>
            <td className="border px-3 py-2">{item.fileName}</td>
            <td className="border px-3 py-2">{item.policyNo}</td>
            <td className="border px-3 py-2">{item.status}</td>
            <td className="border px-3 py-2">{item.note}</td>
            </tr>
            ))}
            </tbody>
            </table>
            <div className="text-right mt-4">
            <button
            className="text-sm text-red-600 hover:underline"
            onClick={() => setShowPopup(false)}
            >
            ปิด
            </button>
            </div>
            </div>
        </div>
            ) }
    </div>
  );
};

export default InboxTableView;