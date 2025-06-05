export const MalzemeYok = ({ malzemeler }) => {
  return (
    malzemeler.length === 0 && (
      <div className="text-center py-8 text-gray-600">
        <p>Bu tutanakta malzeme bulunmamaktadır.</p>
      </div>
    )
  );
};
