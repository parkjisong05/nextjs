// src/components/Inbox/InboxDetailView.tsx
'use client';
import React, { useState, useRef,  useEffect } from 'react';
import { InboxRow } from '@/types/inbox';
import dynamic from "next/dynamic";

// Dynamically import the PDF viewer client component.
const PDFViewerClient = dynamic(() => import("../PdfViewer/PDFViewerClient"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        fontSize: "1.2rem",
        color: "#333",
      }}
    >
      Loading PDF Viewer...
    </div>
  ),
});

interface InboxDetailViewProps {
  selectedRow: InboxRow;
  goBack: () => void;
}

// Policy Info Type
interface PolicyInfo {
  policyNo: string;
  insuredClientNo: string;
  ownerClientNo: string;
  policyStatus: string;
  insuredName: string;
  ownerName: string;
  paidToDate: string;
  insuredSex: string;
  ownerSex: string;
  currentYR: string;
  insuredBirthdate: string;
  ownerBirthdate: string;
  md: string;
  insuredAge: string;
  ownerAge: string;
  modePremium: string;
  insuredIdCard: string;
  ownerIdCard: string;
  miscSuspense: string;
  insuredStatus: string;
  premiumSuspense: string;
  agent: string;
  comment: string;
  agency: string;
  contractAddress: string;
}

const InboxDetailView: React.FC<InboxDetailViewProps> = ({ selectedRow, goBack }) => {
  // Sub Tabs State  
  const [activeTab2, setActiveTab2] = useState('tab_endorsement');
  const [activeTabInfo, setActiveTabInfo] = useState('tab_policy_info');
  const [innerActiveTab, setInnerActiveTab] = useState('endorsement');
  
  // UI States
  const [isVisible, setIsVisible] = useState(true);
  const [selectedReason, setSelectedReason] = useState('');
  const [commentDescription, setCommentDescription] = useState('');
  const [isTabsSelected, setIsTabsSelected] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  
  // Resizable PDF height
  // const [pdfHeight, setPdfHeight] = useState(300);

  // Mock Policy Data
  const policyData: PolicyInfo = {
    policyNo: '2171xxxx',
    insuredClientNo: '5629748',
    ownerClientNo: '5629748',
    policyStatus: '4',
    insuredName: 'MR.aaXXXXXXXXX iaX',
    ownerName: 'MR.aaXXXXXXXXX iaXXXXXXXXX',
    paidToDate: '31/01/2568',
    insuredSex: 'ชาย',
    ownerSex: 'ชาย',
    currentYR: '05 / 0',
    insuredBirthdate: '31/1/2514',
    ownerBirthdate: '31/1/2514',
    md: '12',
    insuredAge: '54',
    ownerAge: '54',
    modePremium: '0.00',
    insuredIdCard: '2024000000000',
    ownerIdCard: '2024000000000',
    miscSuspense: '0',
    insuredStatus: 'โสด (1)',
    premiumSuspense: '0',
    agent: '41015',
    comment: '',
    agency: '10003',
    contractAddress: '( )'
  };


  // รายการเมนูที่เราจะแสดง
const menuItems = [
  { label: 'ขอข้อมูล...' },
  { label: 'ระบุซ้ำ...' },
  { label: 'ยกระดับ' },
  { label: 'รีลีส' },
  { label: 'พักการทำงาน' },
  { label: 'เพิกถอน' },
  { label: 'ข้ามการระบุปัจจุบัน' },
  { label: 'เริ่มงาน' },
  { label: 'บันทึก' },
];


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
  
  // const handleTabInfoChange = (tab: string) => setActiveTabInfo(tab);
  const handleInnerTabChange = (tab: string) => setInnerActiveTab(tab);

  // const showDiv = () => {
  //   setActiveTab2('tab_endorsement');
  //   setIsVisible(true);
  // };
  
  // const hideDiv = () => {
  //   setActiveTab2('tab_policyinfo');
  //   setIsVisible(false);
  // };

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  const openPDF = (docKey: string) => {
    const pdfUrls = {
      doc1: '/policy-doc-1.pdf',
      doc2: '/pdf/approval-doc.pdf', 
      doc3: '/pdf/important-doc.pdf'
    };
    const pdfUrl = pdfUrls[docKey as keyof typeof pdfUrls];
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const saveComment = () => {
    console.log('Save Comment:', { selectedReason, commentDescription });
  };

  const saveAndReject = () => {
    console.log('Save and Reject:', { selectedReason, commentDescription });
  };

  const saveAndCancel = () => {
    console.log('Save and Cancel:', { selectedReason, commentDescription });
  };

  const onTabsCheckboxChange = (checked: boolean) => {
    setIsTabsSelected(checked);
  };



  // State สำหรับควบคุมการเปิด/ปิดของ Dropdown
  const [isOpen, setIsOpen] = useState(false);
  
  // useRef สำหรับอ้างอิงถึง DOM element ของ dropdown เพื่อเช็คการคลิกภายนอก
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Logic สำหรับปิด dropdown เมื่อคลิกที่พื้นที่อื่นนอก component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // เพิ่ม event listener เมื่อ component ถูก mount
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup: ลบ event listener ออกเมื่อ component ถูก unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
            <button
          onClick={goBack}
          className="px-2 py-1 text-sm flex items-center btn-primary-custom text-white rounded hover:bg-primary-600-custom"
        >
          ← กลับ
        </button>
        </div>
        <div className="flex justify-end gap-2 mb-1">
 
            <div ref={dropdownRef} className="relative inline-block text-left">
              {/* 1. ส่วนของ Dropdown */}
              <div>
                {/* 2. ปุ่มสำหรับเปิด/ปิด Dropdown */}
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200"
                  id="menu-button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  การดำเนินการ
                  <svg
                    className="-mr-1 h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* 3. ส่วนของเมนู Dropdown */} 
              {isOpen && (
                <div
                  className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                  <div className="py-1" role="none">
                    {/* วนลูปแสดงรายการเมนู */}
                    {menuItems.map((item) => (
                      <a
                        href="#"
                        key={item.label}
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                        id={`menu-item-${item.label}`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          {/* จบส่วน Dropdown */}

          <button  className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
            Approve
          </button>
          <button className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
            Reject
          </button>
          <button className="px-2 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
            Cancel
          </button>
          <button className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-primary-600">
            Release
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {/* Action Buttons */}
    

        {/* Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
          {/* Sub Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1 p-2">
              {[
                { key: 'tab_endorsement', label: 'ENDORSEMENT INFO', icon: '📋' },
                { key: 'tab_policyinfo', label: 'POLICY INFO', icon: '📚' }
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
          <div className="p-4">
            {activeTab2 === 'tab_endorsement' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div><strong>Policy No</strong>: 21694002</div>
                  <div><strong>Insured Name</strong>: MS.KK CK</div>
                  <div><strong>Endorse By</strong>: CTPS800126</div>
                  <div><strong>Tel No</strong>: -</div>
                  <div><strong>Email</strong>: -</div>
                  <div><strong>Sms Language</strong>: -</div>
                </div>
              </div>
            )}

            {activeTab2 === 'tab_policyinfo' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div><strong>Policy No</strong>: 21694002</div>
                  <div><strong>Insured Name</strong>: MS.KK CK</div>
                  <div><strong>Endorse By</strong>: CTPS800126</div>
                </div>

                {/* Nested Info Tabs */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex space-x-1 mb-4 overflow-x-auto">
                    {[
                      'POLICY INFO',
                      'COVERAGE INFO', 
                      'BENEFICIARY INFO',
                      'CLAIM HISTORY',
                      'PAYMENT HISTORY',
                      'JOB STEP'
                    ].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTabInfo(`tab_${tab.toLowerCase().replace(/ /g, '_')}`)}
                        className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded transition-colors ${
                          activeTabInfo === `tab_${tab.toLowerCase().replace(/ /g, '_')}`
                            ? 'bg-primary-custom text-white'
                            : 'text-gray-600 hover:text-primary dark:text-gray-400'
                        }`}
                      >
                        📚 {tab}
                      </button>
                    ))}
                  </div>

                  {/* Policy Info Table */}
                  {activeTabInfo === 'tab_policy_info' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <tbody>
                          {/* Row 1: Policy No. */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom  w-1/6">Policy No.</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100 w-1/6">{policyData.policyNo}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom  w-1/6">Insured Client No.</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100 w-1/6">{policyData.insuredClientNo}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom  w-1/6">Owner Client No.</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100 w-1/6">{policyData.ownerClientNo}</td>
                          </tr>

                          {/* Row 2: Policy Status */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Policy Status</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.policyStatus}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Insured Name</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.insuredName}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Owner Name</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.ownerName}</td>
                          </tr>

                          {/* Row 3: Paid to date */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Paid to date</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.paidToDate}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Sex</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.insuredSex}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Sex</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.ownerSex}</td>
                          </tr>

                          {/* Row 4: Current Y/R */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Current Y/R</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.currentYR}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Birthdate</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.insuredBirthdate}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Birthdate</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.ownerBirthdate}</td>
                          </tr>

                          {/* Row 5: MD */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">MD</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.md}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Age</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.insuredAge}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Age</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.ownerAge}</td>
                          </tr>

                          {/* Row 6: Mode Premium */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Mode Premium</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.modePremium}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">ID Card Number</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.insuredIdCard}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">ID Card Number</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.ownerIdCard}</td>
                          </tr>

                          {/* Row 7: MISC Suspense */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">MISC Suspense</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.miscSuspense}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Status</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.insuredStatus}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom "></td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100"></td>
                          </tr>

                          {/* Row 8: Premium Suspense */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Premium Suspense</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.premiumSuspense}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Agent</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.agent}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom "></td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100"></td>
                          </tr>

                          {/* Row 9: Comment */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Comment</td>
                            <td className="py-2 px-3">
                              <textarea 
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded resize-none bg-gray-50"
                                rows={2}
                                readOnly
                                value={policyData.comment}
                              />
                            </td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Agency</td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{policyData.agency}</td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom "></td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100"></td>
                          </tr>

                          {/* Row 10: Contract Address */}
                          <tr>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom ">Contract Address</td>
                            <td className="py-2 px-3">
                              <div className="space-y-1">
                                <span className="text-gray-500">{policyData.contractAddress}</span>
                                <textarea 
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded resize-none bg-gray-50"
                                  rows={2}
                                  readOnly
                                  placeholder="Address details..."
                                />
                              </div>
                            </td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom "></td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100"></td>
                            <td className="py-2 px-3 font-medium text-primary-600-custom dark:text-primary-400-custom "></td>
                            <td className="py-2 px-3 text-gray-900 dark:text-gray-100"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Other Info Tabs Content */}
                  {['tab_coverage_info', 'tab_beneficiary_info', 'tab_claim_history', 'tab_payment_history', 'tab_job_step'].map(tabKey => (
                    <div key={tabKey} className={activeTabInfo === tabKey ? 'block' : 'hidden'}>
                      <div className="text-center text-gray-500 py-8">
                        {tabKey.replace('tab_', '').replace(/_/g, ' ').toUpperCase()} Content
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Tabs - แสดงเฉพาะเมื่อ isVisible = true (ENDORSEMENT INFO) */}
        {isVisible && activeTab2 === 'tab_endorsement' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-1 p-2">
                {[
                  { key: 'endorsement', label: 'ENDORSEMENT' },
                  { key: 'comment', label: 'COMMENT' },
                  { key: 'history', label: 'HISTORY' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => handleInnerTabChange(tab.key)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      innerActiveTab === tab.key
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-600 hover:text-primary'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              {/* Endorsement Tab */}
              {innerActiveTab === 'endorsement' && (
                <div>
                  {/* PDF Viewer */}
                  <div 
                    className="bg-gray-100 dark:bg-gray-700 border rounded mb-4 flex items-center justify-center text-gray-500"
                    style={{ height: `100%` }}
                  >
                    
                   <div className="h-full flex flex-col">
                    { <PDFViewerClient/>}
                  </div>
                  </div>
                  {/* Endorsement Table */}
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left">ชื่อ</th>
                          <th className="px-4 py-2 text-left">หมายเลขกรมธรรม์</th>
                          <th className="px-4 py-2 text-left">ผู้เอาประกัน</th>
                          <th className="px-4 py-2 text-left">วันที่สร้าง</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              checked={isTabsSelected}
                              onChange={(e) => onTabsCheckboxChange(e.target.checked)}
                              className="mr-2"
                            />
                            1 {selectedRow.topic}
                          </td>
                          <td className="px-4 py-2">{selectedRow.policyNo}</td>
                          <td className="px-4 py-2">{selectedRow.insuredName}</td>
                          <td className="px-4 py-2">{selectedRow.createdAt}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Document Tree */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <span className="text-lg mr-2">📁</span>
                      <span className="font-medium">Document Explorer</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="mr-2">📊</span>
                        <span>ข้อมูลหลัก</span>
                      </div>

                      <div className="flex items-center">
                        <span className="mr-2">📋</span>
                        <span>ใบอนุญาตประมูลประกันภัย</span>
                      </div>

                      <div>
                        <div 
                          className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded"
                          onClick={() => toggleNode('dateNode')}
                        >
                          <span className="mr-2">
                            {expandedNodes['dateNode'] ? '▼' : '▶'}
                          </span>
                          <span className="mr-2">📅</span>
                          <span 
                            className="text-blue-600 underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPDF('doc1');
                            }}
                          >
                            12 Nov 2012(1)
                          </span>
                        </div>

                        {expandedNodes['dateNode'] && (
                          <div className="ml-8 space-y-1">
                            <div className="flex items-center">
                              <span className="mr-2">📄</span>
                              <span>เอกสารแนบ 1</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2">📄</span>
                              <span>เอกสารแนบ 2</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comment Tab */}
              {innerActiveTab === 'comment' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Reason</label>
                    <select
                      value={selectedReason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">-- Select Reason --</option>
                      <option value="A">ข้อมูลไม่ถูกต้อง</option>
                      <option value="B">ปฏิเสธไม่เข้าเงื่อนไข</option>
                      <option value="C">ขอเอกสารเพิ่มเติม</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={commentDescription}
                      onChange={(e) => setCommentDescription(e.target.value)}
                      rows={3}
                      placeholder="Enter your comment here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={saveComment}
                      className="px-4 py-2 bg-primary-custom text-white text-sm rounded hover:bg-primary-600"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={saveAndReject}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      SAVE & REJECT
                    </button>
                    <button
                      onClick={saveAndCancel}
                      className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                    >
                      SAVE & CANCEL
                    </button>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {innerActiveTab === 'history' && (
                <div>
                  <h6 className="font-bold mb-4">Transaction History</h6>
                  <div className="space-y-3">
                    {[
                      { date: '25 มิ.ย. 2568', action: 'อนุมัติโดย mtl876XXX', status: 'Approved', color: 'bg-green-100 text-green-800' },
                      { date: '24 มิ.ย. 2568', action: 'รับเรื่องโดย mtl876XXX', status: 'Received', color: 'bg-blue-100 text-blue-800' },
                      { date: '23 มิ.ย. 2568', action: 'สร้างเรื่องโดย mtl876XXX', status: 'Created', color: 'bg-gray-100 text-gray-800' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <div>
                          <div className="font-bold">{item.date}</div>
                          <div>{item.action}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxDetailView;
