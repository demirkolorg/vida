import { useMemo, useEffect, useState } from 'react';

export const Altbilgi = ({ malzemeler, currentPage = null, totalPages = null }) => {
  const [detectedPages, setDetectedPages] = useState({ current: 1, total: 1 });

  // Print bilgilerini algıla
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        const container = document.querySelector('[data-print-container]');
        if (container) {
          const containerHeight = container.scrollHeight;
          const pageHeight = 297 * 3.78; // A4 mm to px
          const estimatedPages = Math.ceil(containerHeight / pageHeight);

          setDetectedPages(prev => ({
            current: prev.current,
            total: Math.max(estimatedPages, 1),
          }));
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // İlk hesaplama

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [malzemeler]);

  const { calculatedCurrentPage, calculatedTotalPages } = useMemo(() => {
    // Manuel prop'lar varsa onları kullan
    if (currentPage !== null && totalPages !== null) {
      return {
        calculatedCurrentPage: currentPage,
        calculatedTotalPages: totalPages,
      };
    }

    // Algılanan print bilgilerini kullan
    return {
      calculatedCurrentPage: currentPage || 1,
      calculatedTotalPages: totalPages || detectedPages.total,
    };
  }, [currentPage, totalPages, detectedPages]);

  return (
   



<div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-xs text-gray-600 print:text-black border-t pt-2">
      <div className="font-medium">
        VİDA
      </div>
      <div className="font-medium">
        {calculatedCurrentPage}/{calculatedTotalPages}
      </div>
    </div>


  );
};