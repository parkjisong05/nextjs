'use client';
import React, { useState } from 'react';
import { InboxRow } from '@/types/inbox';
import Checkbox from '../form/input/Checkbox'; // สมมติว่าคุณมี component นี้อยู่
import { CiExport } from "react-icons/ci";
import { VscGraphLeft } from "react-icons/vsc";
import { HiOutlineRefresh } from "react-icons/hi";
import { useRouter } from "next/navigation";
import DatePicker from '../form/date-picker';

interface InboxTableViewProps {
  rows: any[]
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
          <span className='mr-2'>🔍</span> จัดการ ส่งไฟล์ เพื่อพิมพ์สลักหลัง
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
<div className="grid grid-cols-2 gap-x-16 gap-y-4 max-w-[1300px] mx-auto">

  {/* Row 3 */}
  <div className="flex items-center space-x-4">
    <label className="w-55 text-right font-medium">  เลือกรายการที่ต้องการสั่งพิมพ์ <span className="text-red-500">*</span> :</label>
    <select className="w-64 h-12 border rounded px-3">
       <option>LI01: FPO1</option>
    </select>
  </div>
  <div className="flex items-center space-x-4">
    <label className="w-55 text-right font-medium">POLICY NO :</label>
    <input type="text" className="w-64 h-12 border rounded px-3" />
  </div>

  {/* Row 4 */}
  <div className="flex items-center space-x-4">
    <label className="w-40 text-right font-medium">CLIENT NO :</label>
       <input type="text" className="w-64 h-12 border rounded px-3" />
  </div>

  {/* Buttons */}
  <div className="col-span-2 flex justify-center mt-4 space-x-4">
    <button className="flex items-center space-x-2 px-4 py-2 bg-primary-custom text-white text-sm rounded hover:bg-primary-600">
      <span>🔍</span>
      <span>ค้นหา</span>
    </button>
    <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
      <span>❌</span>
      <span>ยกเลิก</span>
    </button>
  </div>
</div>
</div>



        {filteredRows.length > 0 ? (
          <div style={{ minWidth: '1800px' }} className="p-4">
        <table className="w-full text-sm bg-white border border-gray-200 rounded-lg overflow-hidden">
  <thead className="bg-primary-custom sticky top-0 z-10" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
    <tr>
       <th className="px-4 py-3 text-center border-r">
      <input type="checkbox" />
    </th>
      <th className="px-4 py-3 font-medium text-white text-center border-r border-gray-300">ลำดับ</th>
      <th className="px-4 py-3 font-medium text-white text-center border-r border-gray-300">เลขที่เลขกรมธรรม์</th>
      <th className="px-4 py-3 font-medium text-white text-center border-r border-gray-300">Client No</th>
      <th className="px-4 py-3 font-medium text-white text-center border-r border-gray-300">ประเภทสลักหลัง</th>
      <th className="px-4 py-3 font-medium text-white text-center border-r border-gray-300">ประเภทเอกสาร</th>
      <th className="px-4 py-3 font-medium text-white text-center border-r border-gray-300">วันที่อนุมัติ</th>
      <th className="px-4 py-3 font-medium text-white text-center border-r border-gray-300">สถานะ</th>
      <th className="px-4 py-3 font-medium text-white text-center border-r border-gray-300">ทีมงาน</th>
      <th className="px-4 py-3 font-medium text-white text-center border-r border-gray-300">สถานะการพิมพ์</th>
      <th className="px-4 py-3 font-medium text-white text-center border-r border-gray-300">ครั้งที่พิมพ์</th>
      <th className="px-4 py-3 font-medium text-white text-center border-r border-gray-300">วันที่พิมพ์</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200 bg-white">
    {[
      {
        id: 1,
        policyNo: "1072163983",
        clientNo: "1203065799",
        type: "CIA แก้ไขวันเดือนปีเกิด (แก้ไขอายุ)",
        docType: "03",
        approveDate: "08/01/2559",
        status: "APPROVE",
        team: "FPO1",
        printStatus: "PRINTED",
        printCount: 2,
        printDate: "03/05/2559",
      },
      {
        id: 2,
        policyNo: "1062573613",
        clientNo: "1200028459",
        type: "CPM เปลี่ยน mode",
        docType: "03",
        approveDate: "04/04/2559",
        status: "APPROVE",
        team: "FPO1",
        printStatus: "PRINTED",
        printCount: 2,
        printDate: "03/05/2559",
      },
      {
        id: 3,
        policyNo: "1084243815",
        clientNo: "1203832650",
        type: "CPM เปลี่ยน mode",
        docType: "03",
        approveDate: "25/04/2559",
        status: "APPROVE",
        team: "FPO1",
        printStatus: "PRINTED",
        printCount: 2,
        printDate: "03/05/2559",
      },
      {
        id: 4,
        policyNo: "1039939897",
        clientNo: "1200678580",
        type: "CNI แก้ไขชื่อ-นามสกุล ผผป.",
        docType: "03",
        approveDate: "25/04/2559",
        status: "APPROVE",
        team: "FPO1",
        printStatus: "PRINTED",
        printCount: 2,
        printDate: "03/05/2559",
      },
      {
        id: 5,
        policyNo: "1034064931",
        clientNo: "1200107658",
        type: "PTM ยกเลิกตามควบ แบบมีทุนประกัน",
        docType: "03",
        approveDate: "25/04/2559",
        status: "APPROVE",
        team: "FPO1",
        printStatus: "PRINTED",
        printCount: 2,
        printDate: "03/05/2559",
      },
    ].map((row) => (
      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-center border-r">
        <input type="checkbox" />
      </td>
        <td className="px-4 py-3 text-center border-r">{row.id}</td>
        <td className="px-4 py-3 text-center border-r">{row.policyNo}</td>
        <td className="px-4 py-3 text-center border-r">{row.clientNo}</td>
        <td className="px-4 py-3 border-r">{row.type}</td>
        <td className="px-4 py-3 text-center border-r">{row.docType}</td>
        <td className="px-4 py-3 text-center border-r">{row.approveDate}</td>
        <td className="px-4 py-3 text-center border-r">{row.status}</td>
        <td className="px-4 py-3 text-center border-r">{row.team}</td>
        <td className="px-4 py-3 text-center border-r">{row.printStatus}</td>
        <td className="px-4 py-3 text-center border-r">{row.printCount}</td>
        <td className="px-4 py-3 text-center border-r">{row.printDate}</td>
      </tr>
    ))}
  </tbody>
</table>
<div className="flex justify-between items-center mt-4">
<div className="flex items-center space-x-2">
<label htmlFor="printer" className="text-sm font-medium">เลือกเครื่องพิมพ์</label>
<select id="printer" className="border rounded px-2 py-1 text-sm">
<option>SELECT PRINTER</option>
{/* Add printer options */}
</select>
<button className="bg-primary-custom text-white px-4 py-2 rounded hover:bg-primary-600 text-sm">
Print
</button>
</div>
</div>
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

    </div>
  );
};

export default InboxTableView;