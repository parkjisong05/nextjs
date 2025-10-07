'use client';
import React, { useState } from 'react';
import Switch from '../form/switch/Switch';
import { useRouter } from 'next/navigation';



const  Edit  = () => {
 // เพิ่มไว้ด้านบนของ component
const [showPopup, setShowPopup] = useState(false);
const [selectedUsers, setSelectedUsers] = useState([]);
const [searchTerm, setSearchTerm] = useState("");


const handleToggleUser = (userId : any) => {
setSelectedUsers((prev: any) =>
prev.includes(userId)
? prev.filter((id: any) => id !== userId)
: [...prev, userId]
);
};


const handleConfirmUsers = () => {
setShowPopup(false);
};


const userList = [
{id: 'mtl80883', name: 'สมชาย'},
{id: 'mtl12345', name: 'สมหญิง'},
{id: 'admin001', name: 'ผู้ดูแลระบบ'}
];


  const router = useRouter();
const filteredUsers = userList.filter(
(user) =>
user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
user.name.toLowerCase().includes(searchTerm.toLowerCase())
);

   
      const [selectedUser, setSelectedUser] = useState("");
  const [activeTab2, setActiveTab2] = useState('tab_endorsement');
  const [activeTabInfo, setActiveTabInfo] = useState('tab_policy_info');
  const [innerActiveTab, setInnerActiveTab] = useState('endorsement');
const [isVisible, setIsVisible] = useState(true);
  // Event Handlers
  const handleTab2Change = (tab: string) => {
    setActiveTab2(tab);
    // กำหนดการแสดง Enhanced Tabs ตาม tab ที่เลือก
    if (tab === 'tab_endorsement') {
      setIsVisible(true);   // แสดง Enhanced Tabs
    } else if (tab === 'tab_policyinfo') {
      setIsVisible(false);  // ซ่อน Enhanced Tabs
    }
  };
   return (
    
     // Container หลักของ View: ใช้ flex-col เพื่อจัดเรียง Toolbar และ Table Container ในแนวตั้ง
     <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
             <div className="flex items-center space-x-3">
        </div>
          <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center lg:justify-between p-2 bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800 space-y-4 lg:space-y-0 relative z-30">
        {/* ส่วนซ้ายของ Toolbar */}
        
        <div className="flex flex-wrap items-center space-x-4 p-2 ">
            
            <button
          onClick={() => router.push("/rules")} 
          className="px-2 py-1 text-sm flex items-center btn-primary-custom text-white rounded hover:bg-primary-600-custom"
        >
          ← กลับ
        </button>
          <span className='mr-2'>🔍</span> แก้ไข Rules
        </div>
        </div>
       {/* Table Container: ส่วนนี้จะยืดเต็มพื้นที่ที่เหลือและมี scroll bar ของตัวเอง */}
       <div className="bg-white dark:bg-gray-900 overflow-auto p-4" style={{
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
               <option value="Round Robin">Round Robin</option>
               <option value="Pool">Pool</option>
               <option value="Specific">Specific</option>
             </select>
           </div>
           {/* ลำดับการแจกงาน */}
            <div className="flex justify-center items-center space-x-4">
            <label className="w-48 text-base font-medium text-right">
                ลำดับการแจกงาน :
            </label>
            <input
                type="text"
                placeholder="กรอกลำดับ..."
                className="h-12 w-[400px] px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
 

       </div>
 
       </div>


        {/* Info Card */}
        
          <div className="p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
          {/* Sub Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1 p-2">
              {[
                { key: 'tab_endorsement', label: 'JOB Type', icon: '📋' },
                { key: 'tab_policyinfo', label: 'User', icon: '📚' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => handleTab2Change(tab.key)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab2 === tab.key
                      ? 'bg-primary-custom text-white'
                      : 'text-gray-600 hover:text-primary dark:text-gray-400'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub Tab Content */}
          <div>
            {activeTab2 === 'tab_endorsement' && (
              <div className='bg-gray-100 dark:bg-gray-700 border rounded mb-4'>
                <div>
                    
          <div  className="p-4  h-full flex items-center justify-center">
            <table  style={{ width: '600px' }} className="w-full text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Sticky Header: จะติดอยู่ด้านบนเมื่อ scroll */}
              <thead
                className="bg-primary-custom dark:bg-primary-800-custom sticky top-0 z-10"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                <tr>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '120px' }}>Job Type</th>
                  <th className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-300 text-center" style={{ width: '120px' }}>Yes /No</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
               
                  <tr
                    key='1'
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                     <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700 text-right">
                     งานกระทบเบี้ย
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700  text-center">
                      
             <div className="w-[400px] flex items-center  justify-center space-x-6">
                  <Switch
          label="Yes"
          defaultChecked={true}
        />
             </div>
                    </td>
                     </tr>
                     
                  <tr
                    key='2'
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                     <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700 text-right">
                     งานไม่กระทบเบี้ย
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700  text-center">
             <div className="w-[400px] flex items-center  justify-center space-x-6">
                  <Switch
          label="Yes"
          defaultChecked={true}
        />
             </div>
                    </td>
                     </tr>
                  <tr
                    key='3'
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                     <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700 text-right">
                     งานต่ออายุ
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700  text-center">
                      
              <div className="w-[400px] flex items-center  justify-center space-x-6">
                  <Switch
          label="Yes"
          defaultChecked={true}
        />
             </div>
                    </td>
                     </tr>
                     
                  <tr
                    key='4'
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                     <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700 text-right">
                     งานกธ. สูญหาย
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700  text-center">
                 <div className="w-[400px] flex items-center  justify-center space-x-6">
                  <Switch
          label="Yes"
          defaultChecked={true}
        />
             </div>
                    </td>
                     </tr>
              </tbody>
            </table>
          </div>
                </div>
                <div className="flex justify-center space-x-4 mt-2 mb-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-custom text-white text-sm rounded hover:bg-primary-600">
                        <span>💾</span>
                        <span>บันทึก</span>
                    </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                        <span>❌</span>
                        <span>ยกเลิก</span>
                    </button>
                    </div>
              </div>
            )}

            {activeTab2 === 'tab_policyinfo' && (
              <div className='bg-gray-100 dark:bg-gray-700 border rounded mb-4'>
              <div>  
                <div className="space-x-4 ml-4 mt-2">
           <button
            onClick={() => setShowPopup(true)}
            className="flex items-center  space-x-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
            <span>👥</span>
            <span>เลือกผู้ใช้</span>
            </button>
            </div>
            </div>
                <div>
                    
          <div  className="p-4  h-full flex items-center justify-center">
            
        <table
  style={{ width: '1800px' }}
  className="w-full text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
>
  <thead className="bg-primary-custom dark:bg-primary-800-custom sticky top-0 z-10"
    style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
    <tr>
      <th className="px-4 py-3 text-white font-medium border-r text-center">ลำดับ</th>
      <th className="px-4 py-3 text-white font-medium border-r text-center">User</th>
      <th className="px-4 py-3 text-white font-medium border-r text-center">Priority</th>
      <th className="px-4 py-3 text-white font-medium border-r text-center">สถานะใช้งาน</th>
      <th className="px-4 py-3 text-white font-medium border-r text-center">งานกระทบเบี้ย</th>
      <th className="px-4 py-3 text-white font-medium border-r text-center">งานไม่กระทบเบี้ย</th>
      <th className="px-4 py-3 text-white font-medium border-r text-center">งานต่ออายุ</th>
      <th className="px-4 py-3 text-white font-medium text-center">งานกธ. สูญหาย</th>
    </tr>
  </thead>

  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
      <td className="px-4 py-3 text-center text-gray-700 border-r">1</td>
      <td className="px-4 py-3 text-center text-gray-700 border-r">mtl80883</td>
      <td className="px-4 py-3 text-center text-gray-700 border-r">1</td>
      <td className="px-4 py-3 text-center text-green-600 font-semibold border-r">Active</td>

      {/* งานกระทบเบี้ย */}
      <td className="px-4 py-3 text-center border-r">
        <select className="border border-gray-300 rounded px-2 py-1">
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </td>

      {/* งานไม่กระทบเบี้ย */}
      <td className="px-4 py-3 text-center border-r">
        <select className="border border-gray-300 rounded px-2 py-1">
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </td>

      {/* งานต่ออายุ */}
      <td className="px-4 py-3 text-center border-r">
        <select className="border border-gray-300 rounded px-2 py-1">
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </td>

      {/* งานกธ. สูญหาย */}
      <td className="px-4 py-3 text-center">
        <select className="border border-gray-300 rounded px-2 py-1">
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </td>
    </tr>
  </tbody>
</table>
          </div>
                </div>
                <div className="flex justify-center space-x-4 mt-2 mb-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-custom text-white text-sm rounded hover:bg-primary-600">
                        <span>💾</span>
                        <span>บันทึก</span>
                    </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                        <span>❌</span>
                        <span>ยกเลิก</span>
                    </button>
                    </div>
              </div>
            )}
          </div>
        </div>
</div>
     {showPopup && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg w-[600px]">
        <h2 className="text-lg font-semibold mb-4">เลือกผู้ใช้</h2>


        {/* ค้นหา */}
        <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="ค้นหา User ID หรือ ชื่อ..."
        className="mb-4 w-full px-3 py-2 border border-gray-300 rounded"
        />


        <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
        <tr>
        <th className="border px-3 py-2 text-left">User ID</th>
        <th className="border px-3 py-2 text-left">Name</th>
        <th className="border px-3 py-2 text-center"><input
        type="checkbox"
        /> เลือกทั้งหมด </th>
        </tr>
        </thead>
        <tbody>
        {filteredUsers.map((user : any) => (
        <tr key={user.id} className="hover:bg-gray-50">
        <td className="border px-3 py-2">{user.id}</td>
        <td className="border px-3 py-2">{user.name}</td>
        <td className="border px-3 py-2 text-center">
        <input
        type="checkbox"
        onChange={() => handleToggleUser(user.id)}
        />
        </td>
        </tr>
        ))}
        </tbody>
        </table>
        <div className="mt-4 text-right space-x-4">
        <button
        className="text-sm text-green-600 hover:underline"
        onClick={handleConfirmUsers}
        >
        ตกลง
        </button>
        <button
        className="text-sm text-red-500 hover:underline"
        onClick={() => setShowPopup(false)}
        >
        ปิด
        </button>
        </div>
        </div>
        </div>
        )}
     </div>

   );
};

export default Edit;