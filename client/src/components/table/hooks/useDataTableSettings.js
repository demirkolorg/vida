import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { getMySettings, updateMySettings } from '@/api/userSettings';

export function useDataTableSettings(entityType, columnVisibilityData, includeAuditColumns) {
  const [userSettings, setUserSettings] = useState(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnSizing, setColumnSizing] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);

  // Kullanıcı ayarlarını yükleme
  const loadUserSettings = useCallback(async () => {
    try {
      setIsLoadingSettings(true);
      const settings = await getMySettings();
      setUserSettings(settings);
    } catch (error) {
      console.error('Kullanıcı ayarları yüklenemedi:', error);
      toast.error('Ayarlar yüklenirken hata oluştu');
    } finally {
      setIsLoadingSettings(false);
    }
  }, []);

  // Kullanıcı ayarlarını güncelleme
  const updateUserColumnSettings = useCallback(async (entityType, columnSettings) => {
    try {
      const currentSettings = userSettings || {};

      // Mevcut dataTableSettings'i al veya boş obje oluştur
      const dataTableSettings = currentSettings.dataTableSettings || {};

      // Bu entity için ayarları güncelle
      const updatedDataTableSettings = {
        ...dataTableSettings,
        [entityType]: {
          ...dataTableSettings[entityType],
          ...columnSettings,
          timestamp: Date.now()
        }
      };

      const updatedSettings = {
        ...currentSettings,
        dataTableSettings: updatedDataTableSettings
      };

      const result = await updateMySettings(updatedSettings);
      if (result) {
        setUserSettings(updatedSettings);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Kullanıcı ayarları güncellenemedi:', error);
      toast.error('Ayarlar kaydedilemedi');
      return false;
    }
  }, [userSettings]);

  // Kaydedilmiş kolon ayarlarını al
  const savedColumnSettings = useMemo(() => {
    if (!userSettings?.dataTableSettings?.[entityType]) {
      return null;
    }
    return userSettings.dataTableSettings[entityType];
  }, [userSettings, entityType]);

  // İlk görünürlük ayarlarını hesapla
  const initialVisibility = useMemo(() => {
    const auditColumnDefaultVisibility = includeAuditColumns ? { 
      createdBy: false, 
      createdAt: false, 
      updatedBy: false, 
      updatedAt: false 
    } : {};
    const defaultVisibility = { ...auditColumnDefaultVisibility, ...columnVisibilityData };

    // Eğer kaydedilmiş ayarlar varsa, onları kullan
    if (savedColumnSettings?.columnVisibility) {
      return { ...defaultVisibility, ...savedColumnSettings.columnVisibility };
    }

    return defaultVisibility;
  }, [columnVisibilityData, includeAuditColumns, savedColumnSettings]);

  // Debounced kaydetme fonksiyonu
  const debouncedSaveSettings = useCallback(
    (() => {
      let timeoutId;
      return (columnSettings, delay = 1000) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateUserColumnSettings(entityType, columnSettings);
        }, delay);
      };
    })(),
    [entityType, updateUserColumnSettings]
  );

  // Kolon görünürlüğü değiştiğinde veritabanına kaydet
  const handleColumnVisibilityChange = useCallback((updaterOrValue) => {
    const newVisibility = typeof updaterOrValue === 'function' ? 
      updaterOrValue(columnVisibility) : updaterOrValue;
    setColumnVisibility(newVisibility);

    // Debounced kaydetme
    debouncedSaveSettings({
      columnVisibility: newVisibility,
      columnSizing,
      columnOrder
    }, 500);
  }, [columnVisibility, columnSizing, columnOrder, debouncedSaveSettings]);

  // Kolon boyutu değiştiğinde veritabanına kaydet
  const handleColumnSizingChange = useCallback((updaterOrValue) => {
    const newSizing = typeof updaterOrValue === 'function' ? 
      updaterOrValue(columnSizing) : updaterOrValue;
    setColumnSizing(newSizing);

    // Debounced kaydetme (boyut değişikliği için daha uzun süre)
    debouncedSaveSettings({
      columnVisibility,
      columnSizing: newSizing,
      columnOrder
    }, 1500);
  }, [columnVisibility, columnSizing, columnOrder, debouncedSaveSettings]);

  // Kolon sırası değiştiğinde veritabanına kaydet
  const handleColumnOrderChange = useCallback((updaterOrValue) => {
    const newOrder = typeof updaterOrValue === 'function' ? 
      updaterOrValue(columnOrder) : updaterOrValue;
    setColumnOrder(newOrder);

    debouncedSaveSettings({
      columnVisibility,
      columnSizing,
      columnOrder: newOrder
    }, 500);
  }, [columnVisibility, columnSizing, columnOrder, debouncedSaveSettings]);

  // Kolon ayarlarını sıfırlama fonksiyonu
  const resetColumnSettings = useCallback(async () => {
    try {
      // Varsayılan ayarlara dön
      const auditColumnDefaultVisibility = includeAuditColumns ? { 
        createdBy: false, 
        createdAt: false, 
        updatedBy: false, 
        updatedAt: false 
      } : {};
      const defaultVisibility = { ...auditColumnDefaultVisibility, ...columnVisibilityData };

      setColumnVisibility(defaultVisibility);
      setColumnSizing({});
      setColumnOrder([]);

      // Veritabanından da sil
      const success = await updateUserColumnSettings(entityType, {
        columnVisibility: defaultVisibility,
        columnSizing: {},
        columnOrder: []
      });

      if (success) {
        toast.success('Kolon ayarları sıfırlandı');
      } else {
        toast.error('Kolon ayarları sıfırlanamadı');
      }
    } catch (error) {
      console.error('Error resetting column settings:', error);
      toast.error('Kolon ayarları sıfırlanamadı');
    }
  }, [entityType, includeAuditColumns, columnVisibilityData, updateUserColumnSettings]);

  // Component mount olduğunda kullanıcı ayarlarını yükle
  useEffect(() => {
    loadUserSettings();
  }, [loadUserSettings]);

  // Kullanıcı ayarları yüklendikten sonra kolon ayarlarını güncelle
  useEffect(() => {
    if (!isLoadingSettings && savedColumnSettings) {
      if (savedColumnSettings.columnVisibility) {
        const auditColumnDefaultVisibility = includeAuditColumns ? { 
          createdBy: false, 
          createdAt: false, 
          updatedBy: false, 
          updatedAt: false 
        } : {};
        const defaultVisibility = { ...auditColumnDefaultVisibility, ...columnVisibilityData };
        setColumnVisibility({ ...defaultVisibility, ...savedColumnSettings.columnVisibility });
      }

      if (savedColumnSettings.columnSizing) {
        setColumnSizing(savedColumnSettings.columnSizing);
      }

      if (savedColumnSettings.columnOrder) {
        setColumnOrder(savedColumnSettings.columnOrder);
      }
    }
  }, [isLoadingSettings, savedColumnSettings, includeAuditColumns, columnVisibilityData]);

  // İlk visibility state'ini set et
  useEffect(() => {
    setColumnVisibility(initialVisibility);
  }, [initialVisibility]);

  // İlk sizing state'ini set et
  useEffect(() => {
    setColumnSizing(savedColumnSettings?.columnSizing || {});
  }, [savedColumnSettings]);

  return {
    isLoadingSettings,
    columnVisibility,
    columnSizing,
    columnOrder,
    savedColumnSettings,
    handleColumnVisibilityChange,
    handleColumnSizingChange,
    handleColumnOrderChange,
    resetColumnSettings
  };
}