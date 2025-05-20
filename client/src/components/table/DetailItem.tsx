export const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid grid-cols-3 items-center gap-3">
    <span className="text-sm font-medium text-muted-foreground text-right">{label}</span>
    <div className="col-span-2 text-sm">{children || '-'}</div> {/* Show '-' if empty */}
  </div>
);
export const DetailSection = ({ title, children }) => (
  <div className="mb-6"> {/* Bölümler arasına alt boşluk */}
    {title && ( // Sadece title varsa göster
      <h3 className="text-md font-semibold mb-3 border-b pb-2 text-gray-700 dark:text-gray-300"> {/* Başlık stili */}
        {title}
      </h3>
    )}
    <div className="space-y-2"> {/* Bu bölümdeki DetailItem'lar arasına boşluk */}
      {children}
    </div>
  </div>
);