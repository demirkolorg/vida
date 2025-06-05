export const Imza = ({imzaAlanlari}) => {
  return (
    <div className="mt-auto pt-8">
      <div className="grid grid-cols-3 text-center">
        
        {imzaAlanlari.map((alan, index) => (
          <div key={index} className={` ${alan.hidden ? 'invisible' : ''}`}>
            <div className="font-semibold">{alan.label}</div>
            <p className="flex items-center justify-center h-14 text-xs text-center text-gray-200 border-b border-black mb-1">imza</p>
            {alan.name ? (
              <div className="min-h-[20px] text-sm font-medium ">{alan.name}</div>
            ) : (
              <>
                <div className="text-xs">{alan.field}</div>
                <div className="text-xs">İmza</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
