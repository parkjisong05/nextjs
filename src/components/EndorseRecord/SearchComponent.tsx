'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { NavGroup, InboxRow, MenuType } from '@/types/inbox';
import Main from './main';
import { useWorkList } from '@/hooks/useWorkList';


// Static Data: ย้ายออกมาไว้นอก Component เพื่อป้องกัน re-render loop
const initialRows: any[] = [
  {
    id: 1,
    A1: '100',
    A2: '80',
    A3: '10',
    A4: '5',
    A5: '5'
  }
];

const menuKeys: MenuType[] = ['view'];
const menuLabels = { view: 'วิว' };
const menuIcons = { view: '📋', link: '🔗' };

const SearchComponent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedRow, setSelectedRow] = useState<InboxRow | null>(null);
  const [resizing, setResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(290);
  const [selectedMenu, setSelectedMenu] = useState<MenuType>('view');
  // const [rows, setRows] = useState<InboxRow[]>([]);
  const { rows, isLoading, error, fetchWorkList, setRows } = useWorkList();
  const containerRef = useRef<HTMLDivElement>(null);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'อินบ็อกซ์': true,
    'วิวที่ใช้ร่วมกัน': true,
  });


  const loadRows = useCallback((id: string) => {
    if (id === "0") {
      setRows([]);
    } else {
      setRows([...initialRows]);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  
  const toggleGroup = (group: NavGroup) => {
    setExpandedGroups(prev => ({ ...prev, [group.title]: !prev[group.title] }));
  };
  
  const selectRow = (row: InboxRow) => setSelectedRow(row);
  const goBack = () => setSelectedRow(null);
  const selectMenu = (menu: MenuType) => setSelectedMenu(menu);
  const selectMenuBar = (itemId: string) => loadRows(itemId);

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

  useEffect(() => {
    loadRows('1');
  }, [loadRows]);

  return (
    // ✅ FIX: ใช้ w-full h-full เพื่อยืดเต็มพื้นที่ของ parent (จาก page.tsx)
    // และใช้ flexbox เพื่อส่งต่อ layout ให้ child (InboxWorkTab) อย่างถูกต้อง
    <div 
      className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-full h-full"
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Main
        rows={rows}
        resizing={resizing}
      />
    </div>
  );
};

export default SearchComponent;