import { useMemo } from 'react';

export function useDataTableSummary(data, summarySetup) {
  const allSummaries = useMemo(() => {
    if (!summarySetup || summarySetup.length === 0 || !data || data.length === 0) {
      return null;
    }
    
    const summaries = {};
    
    summarySetup.forEach(setup => {
      const { columnId, title } = setup;
      const counts = {};
      
      try {
        data.forEach(row => {
          const value = row[columnId];
          const key = String(value ?? 'Bilinmeyen');
          counts[key] = (counts[key] || 0) + 1;
        });
        
        const items = Object.entries(counts)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([key, count]) => ({ key, count }));
          
        summaries[String(columnId)] = { title, items };
      } catch (error) {
        console.error(`Summary calculation failed for column: ${String(columnId)}`, error);
      }
    });
    
    return summaries;
  }, [data, summarySetup]);

  return {
    allSummaries
  };
}