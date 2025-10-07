// src/mappers/inboxMapper.ts

import { InboxRow } from "@/types/inbox";
import { ApiWorkListItem } from "@/api/inboxService";

/**
 * ฟังก์ชันสำหรับแปลงข้อมูลจาก API (ApiWorkListItem) ให้เป็นข้อมูลที่ UI ต้องการ (InboxRow)
 * @param apiData - Array ของข้อมูลที่ได้จาก API
 * @returns Array ของข้อมูลที่พร้อมใช้งานใน UI
 */
export const mapApiWorkListToInboxRows = (apiData: ApiWorkListItem[]): InboxRow[] => {
  if (!Array.isArray(apiData)) {
    return []; // ถ้าข้อมูลไม่ใช่ array ให้ return array ว่าง
  }
  
  return apiData.map((item : any) => ({
    id: item.workListId,
    topic: item.endrDesc + ' กธ. ' + item.policyNo || 'N/A',
    
    // 🔧 แปลง count เป็น number
    count: typeof item.taskNo === 'string' 
      ? parseInt(item.taskNo, 10) || 0 
      : (item.taskNo || 0),
    
    // 🔧 แปลง priority เป็น number  
    priority: typeof item.priority === 'string' 
      ? parseInt(item.priority, 10) || 1 
      : (item.priority || 1),
    
    summaryBy: item.assigneeId || '-',
    statusText: item.jobStatus || '-',
    postFixCode: item.endrCode || '-',
    team: item.team || '-',
    createdAt: item.createDate || '-',
    receivedBy: item.acquirerId || '-',
    systemAt: item.jobAssignDate || '-',
    policyNo: item.policyNo,
    insuredName: item.clientName || '-',
    postMarkUser: item.createBy || '-',
    
    // 🔧 เพิ่ม properties ที่ต้องการ
    a1: item.fileName || '-',
    a2: item.endrCreateDate || '-', 
    a3: item.endrEffectiveDate || '-',
    a4: item.edasDocStatus || '-',
    
    urgency: 'medium' as const,
  }));
};
