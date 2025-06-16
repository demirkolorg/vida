// Global search'ten gelen sonuçların nasıl handle edileceği
export const createGlobalSearchNavigationHandler = (navigate, toast) => {
  return (item, entityType, options = {}) => {
    const { action } = options;

    // Entity type'a göre navigasyon
    switch (entityType) {
      case 'personel':
        if (action === 'edit') {
          navigate(`/personel?highlight=${item.id}&action=edit`);
          toast.success(`${item.ad} ${item.soyad} düzenleme sayfasına yönlendiriliyorsunuz`);
        } else {
          navigate(`/personel?highlight=${item.id}`);
          toast.success(`${item.ad} ${item.soyad} seçildi`);
        }
        break;

      case 'malzeme':
        if (action === 'edit') {
          navigate(`/malzeme?highlight=${item.id}&action=edit`);
          toast.success(`${item.vidaNo} düzenleme sayfasına yönlendiriliyorsunuz`);
        } else {
          navigate(`/malzeme?highlight=${item.id}`);
          toast.success(`${item.vidaNo} seçildi`);
        }
        break;
      case 'tutanak':
        if (action === 'edit') {
          navigate(`/tutanak?highlight=${item.id}&action=edit`);
          toast.success(`${item.ad} düzenleme sayfasına yönlendiriliyorsunuz`);
        } else {
          navigate(`/tutanak?highlight=${item.id}`);
          toast.success(`${item.ad} tutanağı seçildi`);
        }
        break;
      case 'birim':
        if (action === 'edit') {
          navigate(`/birim?highlight=${item.id}&action=edit`);
          toast.success(`${item.ad} düzenleme sayfasına yönlendiriliyorsunuz`);
        } else {
          navigate(`/birim?highlight=${item.id}`);
          toast.success(`${item.ad} birimi seçildi`);
        }
        break;

      case 'sube':
        navigate(`/sube?highlight=${item.id}`);
        toast.success(`${item.ad} şubesi seçildi`);
        break;

      case 'malzemeHareket':
        navigate(`/malzeme-hareketleri?highlight=${item.id}`);
        toast.success(`Malzeme hareketi seçildi`);
        break;

      default:
        navigate(`/${entityType}?highlight=${item.id}`);
        toast.success(`${item.ad || item.id} seçildi`);
    }
  };
};
