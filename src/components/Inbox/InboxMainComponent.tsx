'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { NavGroup, InboxRow, MenuType, NavItem } from '@/types/inbox';
import InboxWorkTab from './InboxWorkTab';
import { useWorkList } from '@/hooks/useWorkList';
import { useNavData } from '@/hooks/useNavData';

const menuKeys: MenuType[] = ['view'];
const menuLabels: Record<MenuType, string> = { 
  view: 'วิว',
  link: 'ลิงค์' // 🔧 เพิ่ม link property
};
const menuIcons: Record<MenuType, string> = { 
  view: '📋', 
  link: '🔗' 
};

const InboxMainComponent = () => {
  // 1. Hooks for data fetching
const { rows, isLoading: isWorkListLoading, error: workListError, fetchWorkList } = useWorkList();
const { navData, isLoading: isNavDataLoading, error: navDataError, refetch: refetchNavData } = useNavData();


  // 2. State for UI and Logic
  const [hasMenuBeenSelected, setHasMenuBeenSelected] = useState<boolean>(false);
  const [selectedViewNo, setSelectedViewNo] = useState<string | null>(null);
  
  // Other UI states
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedRow, setSelectedRow] = useState<InboxRow | null>(null);
  const [resizing, setResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(290);
  const [selectedMenu, setSelectedMenu] = useState<MenuType>('view');
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // 🔧 3. Create dynamic navData - เพิ่ม link property
  const dynamicNavData: Record<MenuType, NavGroup[]> = {
    view: navData.map(group => ({
      ...group,
      expanded: expandedGroups[group.title] ?? true,
    })),
    link: [] // 🔧 เพิ่ม empty array สำหรับ link
  };
  
  // 4. แก้ไข selectMenuBar ให้รับ NavItem object
  const selectMenuBar = useCallback((item: NavItem) => {
    console.log('selectMenuBar received:', item);
    
    // ใช้ viewNo จาก NavItem ถ้ามี
    let targetViewNo: string;
    
    if (item.viewNo) {
      targetViewNo = String(item.viewNo);
    } else {
      // ถ้าไม่มี viewNo ให้ extract จาก item.id
      const numberMatch = String(item.id).match(/\d+$/);
      targetViewNo = numberMatch?.[0] || String(item.id);
    }
    
    console.log('Using targetViewNo:', targetViewNo);
    
    setHasMenuBeenSelected(true);
    setSelectedViewNo(targetViewNo);
    fetchWorkList({ viewNo: targetViewNo });
  }, [fetchWorkList]);

  // 5. Refresh handler
  const handleRefresh = useCallback(() => {
    refetchNavData();
    if (selectedViewNo !== null) {
      fetchWorkList({ viewNo: selectedViewNo });
    }
  }, [refetchNavData, selectedViewNo, fetchWorkList]);

  // Effect to set initial expanded state for menu groups from API
  useEffect(() => {
    if (navData.length > 0 && Object.keys(expandedGroups).length === 0) {
      const initialExpandedState = navData.reduce((acc, group) => {
        acc[group.title] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedGroups(initialExpandedState);
    }
  }, [navData, expandedGroups]);
  
  // 6. Effect for INITIAL DATA LOAD
  useEffect(() => {
    if (navData.length > 0 && !hasMenuBeenSelected) {
      let firstItem: NavItem | null = null;
      
      for (const group of navData) {
        for (const item of group.items) {
          const countMatch = item.label.match(/\((\d+)\)$/);
          const count = countMatch ? parseInt(countMatch[1]) : 0;
          
          if (count > 0) {
            firstItem = item;
            break;
          }
        }
        if (firstItem) break;
      }
      
      if (!firstItem && navData[0]?.items[0]) {
        firstItem = navData[0].items[0];
      }
      
      if (firstItem) {
        selectMenuBar(firstItem);
      }
    }
  }, [navData, hasMenuBeenSelected, selectMenuBar]);

  // UI actions and resizing logic
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  
  const toggleGroup = useCallback((group: NavGroup) => { 
    setExpandedGroups(prev => ({ 
      ...prev, 
      [group.title]: !prev[group.title] 
    }));
  }, []);
  
  const selectRow = (row: InboxRow) => setSelectedRow(row);
  const goBack = () => setSelectedRow(null);
  const selectMenu = (menu: MenuType) => setSelectedMenu(menu);
  
  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizing || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const minWidth = 200;
    const maxWidth = containerRect.width - 40;
    const newWidth = Math.max(minWidth, Math.min(mouseX, maxWidth));
    setSidebarWidth(newWidth);
  }, [resizing]);
  
  const handleMouseUp = useCallback(() => {
    if (resizing) {
      setResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [resizing]);
  
  useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="w-full h-full" style={{ display: 'flex', flexDirection: 'column' }}>
      <InboxWorkTab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        selectedRow={selectedRow}
        selectRow={selectRow}
        goBack={goBack}
        
        rows={rows}
        navData={dynamicNavData}
        isLoading={isWorkListLoading || isNavDataLoading}
        error={workListError || navDataError}
        onRefresh={handleRefresh}
        
        selectedMenu={selectedMenu}
        selectMenu={selectMenu}
        toggleGroup={toggleGroup}
        selectMenuBar={selectMenuBar}
        
        resizing={resizing}
        sidebarWidth={sidebarWidth}
        startResize={startResize}
        containerRef={containerRef}
        
        menuKeys={menuKeys}
        menuLabels={menuLabels}
        menuIcons={menuIcons}
        
        hasMenuBeenSelected={hasMenuBeenSelected}
      />
    </div>
  );
};

export default InboxMainComponent;
