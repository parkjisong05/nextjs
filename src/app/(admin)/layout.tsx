"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isMobileOpen } = useSidebar();

  // ✅ FIX 1: แก้ไข Logic การคำนวณ Margin
  // เมื่อเมนูไม่ได้ขยายอยู่ (isExpanded = false) ให้ margin เป็น 0
  // เราจะเอา isHovered ออก เพราะเมื่อเมนูซ่อนไปแล้ว จะไม่สามารถ hover ได้
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded
    ? "lg:ml-[290px]" // เมื่อขยายอยู่ ให้มี margin 290px
    : "ml-0";         // เมื่อยุบอยู่ (ซ่อนไปแล้ว) ให้ไม่มี margin

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      
      {/* ✅ FIX 2: แสดง Sidebar และ Backdrop เฉพาะเมื่อจำเป็นเท่านั้น */}
      {/* 
        - บน Desktop: จะแสดง Sidebar ก็ต่อเมื่อ isExpanded เป็น true
        - บน Mobile: จะแสดง Sidebar ก็ต่อเมื่อ isMobileOpen เป็น true 
      */}
      {(isExpanded || isMobileOpen) && <AppSidebar />}
      {isMobileOpen && <Backdrop />}

      {/* Main Content Area */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out overflow-hidden ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <main className="flex-1 min-h-0 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}