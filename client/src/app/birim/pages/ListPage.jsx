// src/app/(features)/birim/page.jsx (Örnek dosya yolu, Next.js App Router için)
// Veya src/app/(features)/birim/birim-list-page.jsx

// 'use client'; // JavaScript dosyasında bu direktife genellikle gerek yoktur.

import React, { useCallback, useEffect } from 'react'; // React importu eklendi
import { Spinner } from '@/components/general/Spinner';

// YEREL
import { useBirimStore } from '../constant/store'; // .js uzantısı eklenebilir
import { BirimCreateSheet } from '../sheet/CreateSheet'; // .jsx uzantısı eklenebilir
import { BirimEditSheet } from '../sheet/EditSheet';   // .jsx uzantısı eklenebilir
import { BirimDeleteSheet } from '../sheet/DeleteSheet'; // .jsx uzantısı eklenebilir
import { BirimDetailSheet } from '../sheet/DetailSheet'; // .jsx uzantısı eklenebilir
import { BirimDataTable } from '../table/dataTable';   // .jsx uzantısı eklenebilir
// Eğer yukarıdaki importlarda dosya adları farklıysa (örneğin birim-create-sheet.jsx),
// o zaman import yolları da ona göre güncellenmeli.

// --- Bileşen Konfigürasyonu ---
const ENTITY_TYPE = 'birim';
const PAGE_TITLE = 'Birim Listesi';

export function BirimListPage() {
  const data = useBirimStore(state => state.datas);
  const fetchData = useBirimStore(state => state.FetchAll);
  const loadingList = useBirimStore(state => state.loadingList);
  const lastFetchAllTime = useBirimStore(state => state.lastFetchAllTime);


  useEffect(() => {
    if (data.length === 0) { // Bu, sayfa yenilendiğinde ve store boş olduğunda çalışır.
        fetchData({ showToast: false });
    }
  }, [fetchData]); // fetchData store'dan geldiği için referansı genellikle stabildir.



  const handleRefreshData = useCallback(() => {
    fetchData({ showToast: true, force: true });
  }, [fetchData]);

  if (loadingList && data.length === 0) {
    // JSX için React importu gerekli
    return <Spinner wText text={`${PAGE_TITLE} yükleniyor...`} />;
  }

  return (
    // JSX için React importu gerekli
    <div className="container mx-auto py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {PAGE_TITLE}
        </h1>
        {/*
        <Button onClick={() => useSheetStore.getState().openSheet('create', ENTITY_TYPE)}>
          <PlusCircledIcon className="mr-2 h-4 w-4" /> Yeni Birim Ekle
        </Button>
        */}
      </div>

      <BirimDataTable
        data={data}
        isLoading={loadingList}
        onRefresh={handleRefreshData}
        entityType={ENTITY_TYPE}
        // onRowClick={(item) => useSheetStore.getState().openSheet('detail', ENTITY_TYPE, item.id)}
      />

      <BirimCreateSheet entityType={ENTITY_TYPE} />
      <BirimEditSheet entityType={ENTITY_TYPE} />
      <BirimDeleteSheet entityType={ENTITY_TYPE} />
      <BirimDetailSheet entityType={ENTITY_TYPE} />
    </div>
  );
};

// export default BirimListPage;