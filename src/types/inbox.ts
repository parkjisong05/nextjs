// src/types/inbox.ts

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  viewNo?: string; // 🔧 เพิ่ม viewNo เป็น optional
}

export interface NavGroup {
  title: string;
  expanded: boolean;
  items: NavItem[];
}

export type MenuType = 'view' | 'link';

// Inbox Row Types
export interface InboxRow {
  id: number;
  topic: string;
  count: number;
  priority: number;
  summaryBy: string;
  statusText: string;
  postFixCode: string;
  team: string;
  createdAt: string;
  receivedBy: string;
  systemAt: string;
  policyNo: string;
  insuredName: string;
  postMarkUser: string;
  fileName?: string;
  endrCreateDate?: string;
  endrEffectiveDate?: string;
  edasDocStatus?: string;
  urgency?: 'urgent' | 'high' | 'medium' | 'low';
}

// API Response Types
export interface ApiWorkListItem {
  id: number;
  topic: string;
  count: number;
  priority: number;
  summaryBy: string;
  statusText: string;
  postFixCode: string;
  team: string;
  createdAt: string;
  receivedBy: string;
  systemAt: string;
  policyNo: string;
  insuredName: string;
  postMarkUser: string;
  a1?: string;
  a2?: string;
  a3?: string;
  a4?: string;
  urgency?: 'urgent' | 'high' | 'medium' | 'low';
}

//  Component Props Types
export interface InboxTableViewProps {
  rows: InboxRow[];
  selectRow: (row: InboxRow) => void;
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export interface InboxSidebarPanelProps {
  navData: Record<MenuType, NavGroup[]>;
  selectedMenu: MenuType;
  selectMenu: (menu: MenuType) => void;
  toggleGroup: (group: NavGroup) => void;
  selectMenuBar: (item: NavItem) => void; // 🔧 แก้เป็น NavItem object
  menuKeys: MenuType[];
  menuLabels: Record<MenuType, string>;
  menuIcons: Record<MenuType, string>;
}

export interface InboxWorkTabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  selectedRow: InboxRow | null;
  rows: InboxRow[];
  navData: Record<MenuType, NavGroup[]>;
  selectedMenu: MenuType;
  selectMenu: (menu: MenuType) => void;
  toggleGroup: (group: NavGroup) => void;
  selectMenuBar: (item: NavItem) => void; // 🔧 แก้เป็น NavItem object
  selectRow: (row: InboxRow) => void;
  goBack: () => void;
  resizing: boolean;
  sidebarWidth: number;
  startResize: (e: React.MouseEvent) => void;
  containerRef: React.RefObject<HTMLDivElement | null>; // 🔧 เพิ่ม | null
  menuKeys: MenuType[];
  menuLabels: Record<MenuType, string>;
  menuIcons: Record<MenuType, string>; 
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  hasMenuBeenSelected?: boolean;
}

//  Hook Types
export interface UseWorkListReturn {
  rows: InboxRow[];
  loading: boolean;
  error: string | null;
  loadRows: (viewId: string) => Promise<void>;
}

export interface UseNavDataReturn {
  navData: Record<MenuType, NavGroup[]>;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (group: NavGroup) => void;
}

//  Utility Types
export interface Priority {
  level: 'urgent' | 'high' | 'medium' | 'low';
  color: string;
  icon: string;
  label: string;
}

export interface StatusBadge {
  status: string;
  color: string;
  textColor: string;
  borderColor: string;
}

//  Filter Types
export interface FilterOptions {
  search: string;
  status: string[];
  priority: string[];
  team: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

//  Sort Types
export interface SortConfig {
  key: keyof InboxRow;
  direction: 'asc' | 'desc';
}

//  Pagination Types
export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}
export interface MonitoringRow {
  id: number;
  A1: string | null;
  A2: string | null;
  A3: string | null;
  A4: string | null;
  A5: string | null;
  A6: string | null;
  A7: string | null;
  A8: string | null;
}