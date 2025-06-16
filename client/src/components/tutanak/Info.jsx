export const MalzemeHareketTutanagiInfo = ({ tutanakNo, tarih }) => {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex items-center">
        <span className="font-semibold">Tutanak No:</span>
        <span className="ml-2  border-black px-2 min-w-[120px] text-center">{tutanakNo}</span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold">Tarih:</span>
        <span className="ml-2   border-black px-2 min-w-[120px] text-center">{tarih}</span>
      </div>
    </div>
  );
};
