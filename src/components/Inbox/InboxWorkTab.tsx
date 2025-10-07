'use client';
import React from 'react';
import { NavGroup, InboxRow, MenuType, NavItem } from '@/types/inbox';
import InboxSidebarPanel from './InboxSidebarPanel';
import InboxTableView from './InboxTableView';
import InboxDetailView from './InboxDetailView';

// Interface for props received from InboxMainComponent
interface InboxWorkTabProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  selectedRow: InboxRow | null;
  selectRow: (row: InboxRow) => void;
  goBack: () => void;
  rows: InboxRow[];
  navData: Record<MenuType, NavGroup[]>;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  selectedMenu: MenuType;
  selectMenu: (menu: MenuType) => void;
  toggleGroup: (group: NavGroup) => void;
  selectMenuBar: (item: NavItem) => void;
  resizing: boolean;
  sidebarWidth: number;
  startResize: (e: React.MouseEvent) => void;
  containerRef: React.RefObject<HTMLDivElement | null>; 
  menuKeys: MenuType[];
  menuLabels: Record<MenuType, string>;
  menuIcons: Record<MenuType, string>;
  hasMenuBeenSelected: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const InboxWorkTab: React.FC<InboxWorkTabProps> = ({
  isSidebarCollapsed, 
  toggleSidebar, 
  selectedRow, 
  rows, 
  navData, 
  isLoading, 
  error, 
  onRefresh,
  selectedMenu, 
  selectMenu, 
  toggleGroup, 
  selectMenuBar, 
  selectRow, 
  goBack, 
  resizing,
  sidebarWidth, 
  startResize, 
  containerRef, 
  menuKeys, 
  menuLabels, 
  menuIcons, 
  hasMenuBeenSelected
}) => {
  return (
    <div className={`h-full w-full relative flex-grow min-h-0 ${resizing ? 'select-none' : ''}`}>
      {resizing && ( 
        <div className="fixed inset-0 z-[9999] cursor-col-resize" 
             style={{ background: 'rgba(0,0,0,0.01)', pointerEvents: 'auto' }} /> 
      )}
      
      <div ref={containerRef} className="flex h-full">
        {!isSidebarCollapsed && (
          <>
            <div 
              style={{ width: `${sidebarWidth}px` }} 
              className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0"
            >
              <InboxSidebarPanel
                navData={navData}
                selectedMenu={selectedMenu}
                selectMenu={selectMenu}
                toggleGroup={toggleGroup}
                selectMenuBar={selectMenuBar}
                menuKeys={menuKeys}
                menuLabels={menuLabels}
                menuIcons={menuIcons}
              />
            </div>
            
            <div
              className={`w-1 h-full flex-shrink-0 transition-all duration-150 cursor-col-resize ${
                resizing 
                  ? 'bg-primary-custom w-2 shadow-lg' 
                  : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
              }`}
              onMouseDown={startResize}
              style={{ zIndex: 10000, minWidth: '4px' }}
            />
          </>
        )}
        
        <div className="flex-1 h-full min-h-0 overflow-hidden">
          {selectedRow ? (
            <InboxDetailView selectedRow={selectedRow} goBack={goBack} />
          ) : hasMenuBeenSelected ? (
            <InboxTableView
              rows={rows || []}
              selectRow={selectRow}
              toggleSidebar={toggleSidebar}
              isSidebarCollapsed={isSidebarCollapsed}
              isLoading={isLoading}
              error={error}
              onRefresh={onRefresh}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-800/50">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-lg font-medium mb-2">กรุณาเลือกเมนู</p>
                <p className="text-sm">เลือกรายการจากเมนูด้านซ้ายเพื่อเริ่มต้น</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxWorkTab;
