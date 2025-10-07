// src/mappers/navDataMapper.ts

import { NavGroup, NavItem } from "@/types/inbox";
import { ApiNavItem } from "@/api/inboxService";

// 🔧 Type-safe priority mapping function
const normalizePriority = (priority: unknown): "urgent" | "high" | "medium" | "low" => {
  // Early return for null/undefined
  if (!priority) return 'medium';
  
  // Convert to string for consistent handling
  const priorityStr = String(priority).toLowerCase().trim();
  
  // Priority mapping with comprehensive coverage
  const priorityMap = new Map<string, "urgent" | "high" | "medium" | "low">([
    // Text values
    ['urgent', 'urgent'],
    ['high', 'high'],
    ['medium', 'medium'],
    ['low', 'low'],
    ['critical', 'urgent'],
    ['important', 'high'],
    ['normal', 'medium'],
    ['minor', 'low'],
    
    // Numeric string values
    ['1', 'urgent'],
    ['2', 'high'],
    ['3', 'medium'],
    ['4', 'low'],
    
    // Additional common values
    ['0', 'low'],
    ['5', 'low']
  ]);

  return priorityMap.get(priorityStr) || 'medium';
};

/**
 * แปลงข้อมูลเมนูแบบ Flat Array จาก API ให้เป็นโครงสร้าง NavGroup แบบ Nested
 */
export const mapApiNavToNavData = (apiData: ApiNavItem[]): NavGroup[] => {
  // Input validation
  if (!Array.isArray(apiData)) {
    console.warn('mapApiNavToNavData: Invalid input, expected array');
    return [];
  }

  try {
    const groupHeaders = apiData.filter(item => item?.id === "");
    const childNodes = apiData.filter(item => item?.id !== "" && item?.id);

    const navGroups: NavGroup[] = groupHeaders.map((header, index) => {
      // Validate header
      if (!header?.menugroup || !header?.label) {
        console.warn(`Invalid header at index ${index}:`, header);
        return {
          title: `Group ${index + 1}`,
          expanded: true,
          items: []
        };
      }

      const childGroupName = header.menugroup.replace('Group', '');

      const itemsForThisGroup = childNodes
        .filter(child => {
          return child?.menugroup && 
                 child.menugroup.toLowerCase() === childGroupName.toLowerCase();
        })
        .map((child): NavItem => {
          // Validate child data
          const viewNo = child.viewno ?? 0;
          const label = child.label || 'Unknown Item';
          const cntjob = child.cntjob ?? 0;

          return {
            id: `view_${viewNo}`,
            label: `${label} (${cntjob})`,
            priority: normalizePriority(child.priority),
            viewNo: String(viewNo),
          };
        });

      return {
        title: header.label,
        expanded: true,
        items: itemsForThisGroup,
      };
    });

    return navGroups;

  } catch (error) {
    console.error('Error in mapApiNavToNavData:', error);
    return [];
  }
};
