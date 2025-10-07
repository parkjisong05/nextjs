import { useState, useCallback } from 'react';
import { InboxRow } from '@/types/inbox';
import { getWorkList } from '@/api/inboxService';
import { mapApiWorkListToInboxRows } from '@/mappers/inboxMapper';

interface FetchParams { 
  viewNo: string;
}

export const useWorkList = () => {
  const [rows, setRows] = useState<InboxRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkList = useCallback(async (params: FetchParams) => {
    const { viewNo } = params;
    
    setIsLoading(true);
    setError(null);
    try {
      const apiData = await getWorkList(viewNo);
      const mappedData = mapApiWorkListToInboxRows(apiData);
      setRows(mappedData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล';
      console.error(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { rows, isLoading, error, fetchWorkList, setRows };
};
