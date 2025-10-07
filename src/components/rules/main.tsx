'use client';
import React from 'react';
import { NavGroup, InboxRow, MenuType } from '@/types/inbox';
import InboxTableView from './InboxTableView';

interface InboxWorkTabProps {
  rows: InboxRow[];
  resizing: boolean;
}

const Main: React.FC<InboxWorkTabProps> = ({
  rows,
  resizing
}) => {
  return (
    // ✅ Container นี้จะยืดเต็มความสูงของ Parent (InboxMainComponent)
    <div className={`h-full w-full relative flex-grow min-h-0 ${resizing ? 'select-none' : ''}`}>
     
        <div className="flex-1 h-full min-w-0 overflow-hidden">
           <InboxTableView
              rows={rows || []}
            />
        </div>
    </div>
  );
};

export default Main;