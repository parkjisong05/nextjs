'use client';
import React, { useMemo } from 'react';
import { NavGroup, MenuType, NavItem } from '@/types/inbox';

interface InboxSidebarPanelProps {
  navData: Record<MenuType, NavGroup[]>;
  selectedMenu: MenuType;
  selectMenu: (menu: MenuType) => void;
  toggleGroup: (group: NavGroup) => void;
  selectMenuBar: (item: NavItem) => void;
  menuKeys: MenuType[];
  menuLabels: Record<MenuType, string>;
  menuIcons: Record<MenuType, string>;
}

const InboxSidebarPanel: React.FC<InboxSidebarPanelProps> = ({
  navData,
  selectedMenu,
  selectMenu,
  toggleGroup,
  selectMenuBar,
  menuKeys,
  menuLabels,
  menuIcons
}) => {
  // ฟังก์ชันสำหรับ priority indicators
  const getPriorityIndicator = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="ml-1 text-xs text-red-600 dark:text-red-400 font-medium">🚨</span>;
      case 'high':
        return <span className="ml-1 text-xs text-orange-600 dark:text-orange-400">🔥</span>;
      case 'medium':
        return <span className="ml-1 text-xs text-yellow-600 dark:text-yellow-400">⚠️</span>;
      case 'low':
        return <span className="w-2 h-2 ml-2 bg-green-500 rounded-full"></span>;
      default:
        return null;
    }
  };

  const getItemCountStyle = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200';
    }
  };

  // ฟังก์ชันคำนวณผลรวม count ของแต่ละกลุ่ม
  const getGroupTotalCount = useMemo(() => {
    return (group: NavGroup) => {
      return group.items.reduce((total, item) => {
        const countMatch = item.label.match(/\((\d+)\)$/);
        const count = countMatch ? parseInt(countMatch[1], 10) : 0;
        return total + count;
      }, 0);
    };
  }, []);

  //ฟังก์ชันได้สี badge ตาม priority สูงสุดในกลุ่ม
  const getGroupBadgeStyle = useMemo(() => {
    return (group: NavGroup) => {
      const priorities = group.items.map(item => item.priority).filter(Boolean);
      
      if (priorities.includes('urgent')) {
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200';
      } else if (priorities.includes('high')) {
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200';
      } else if (priorities.includes('medium')) {
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200';
      } else if (priorities.includes('low')) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200';
      }
      
      return 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    };
  }, []);

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-800/50 overflow-y-auto">
      {/* Menu Selector */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-3">
        <div className="flex space-x-1">
          {menuKeys.map((menu) => (
            <button
              key={`menu-${menu}`}
              onClick={() => selectMenu(menu)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                selectedMenu === menu
                  ? 'bg-primary-custom text-white shadow-sm'
                  : 'text-gray-700 hover:bg-primary-100-custom dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{menuIcons[menu]}</span>
              {menuLabels[menu]}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="p-3 space-y-3">
        {(navData[selectedMenu] || []).map((group, groupIndex) => {
          const totalCount = getGroupTotalCount(group);
          const groupBadgeStyle = getGroupBadgeStyle(group);
          
          return (
            <div key={`${selectedMenu}-group-${groupIndex}-${group.title}`} className="mb-4">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group)}
                className="flex items-center justify-between w-full text-left px-3 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-primary-100-custom dark:hover:bg-gray-700 rounded-md transition-all duration-200 group"
              >
                <div className="flex items-center">
                  <svg 
                    className={`w-4 h-4 mr-2 transition-transform duration-200 ${group.expanded ? 'rotate-90' : 'rotate-0'} text-gray-500 group-hover:text-primary-custom`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="font-medium">{group.title}</span>
                </div>
                
                {totalCount > 0 && (
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${groupBadgeStyle}`}>
                    {totalCount.toLocaleString()}
                  </span>
                )}
              </button>
              
              {/* Expandable Items */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${group.expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-6 mt-1 space-y-1">
                  {(group.items || []).map((item) => {
                    const countMatch = item.label.match(/\((\d+)\)$/);
                    const count = countMatch ? parseInt(countMatch[1], 10) : 0;
                    const labelWithoutCount = item.label.replace(/\s*\(\d+\)$/, '');
                    
                    return (
                      <button
                        key={`${selectedMenu}-item-${item.id}`}
                        onClick={() => selectMenuBar(item)} // ✅ ส่ง item object ทั้งหมดกลับไป
                        className="flex items-center justify-between w-full text-left px-1 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-primary-100-custom dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 rounded-md transition-all duration-200 group"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <span className="truncate">{labelWithoutCount}</span>
                          {getPriorityIndicator(item.priority)}
                        </div>
                        
                        {count > -1 && (
                          <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full border ${getItemCountStyle(item.priority)}`}>
                            {count.toLocaleString()}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InboxSidebarPanel;