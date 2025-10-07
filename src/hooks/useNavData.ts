import { useState, useEffect, useCallback } from 'react';
import { NavGroup } from '@/types/inbox';
import { getNavMenuData } from '@/api/inboxService';  
import { mapApiNavToNavData } from '@/mappers/navDataMapper';  

export const useNavData = () => {
  const [navData, setNavData] = useState<NavGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNavData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiData = await getNavMenuData();
      const mappedData = mapApiNavToNavData(apiData);
      setNavData(mappedData);
    } catch (err: unknown) { 
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNavData();
  }, [fetchNavData]);

  return { navData, isLoading, error, refetch: fetchNavData };
};
