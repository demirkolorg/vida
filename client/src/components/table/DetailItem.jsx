export const DetailItem = ({ label, children }) => (
  <div className="grid grid-cols-3 items-center gap-3">
    <span className="text-sm font-medium text-muted-foreground text-right">{label}</span>
    <div className="col-span-2 text-sm">{children || '-'}</div>
  </div>
);

export const DetailSection = ({ title, children }) => (
  <div className="mb-6">
    {title && (
      <h3 className="text-md font-semibold mb-3 border-b pb-2 text-gray-700 dark:text-gray-300">
        {title}
      </h3>
    )}
    <div className="space-y-2">
      {children}
    </div>
  </div>
);