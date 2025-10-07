import { Metadata } from "next";
import SearchComponent from "@/components/Printing/SearchComponent"; 
export const metadata: Metadata = {
  title: "Inbox | TailAdmin - Next.js Dashboard Template",
  description: "Inbox page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function InboxPage() {
  return ( 
    <div className="h-full w-full rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
      <SearchComponent/>
    </div>
  );
}