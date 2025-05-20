import React, { useCallback, useEffect } from 'react';
import { Spinner } from '@/components/general/Spinner';
import { useBirimStore } from '../constant/store';
import { BirimCreateSheet } from '../sheet/CreateSheet';
import { BirimEditSheet } from '../sheet/EditSheet';
import { BirimDeleteSheet } from '../sheet/DeleteSheet';
import { BirimDetailSheet } from '../sheet/DetailSheet';
import { BirimDataTable } from '../table/dataTable';
import { ENTITY_HUMAN} from '../constant/api';

export function BirimListPage() {
  const data = useBirimStore(state => state.datas);
  const fetchData = useBirimStore(state => state.FetchAll);
  const loadingList = useBirimStore(state => state.loadingList);
  const lastFetchAllTime = useBirimStore(state => state.lastFetchAllTime);


  useEffect(() => {
    if (data.length === 0) {
      fetchData({ showToast: false });
    }
  }, [fetchData]); 


  const handleRefreshData = useCallback(() => {
    fetchData({ showToast: true, force: true });
  }, [fetchData]);

  if (loadingList && data.length === 0) {
    return <Spinner wText text={`${ENTITY_HUMAN} listesi yükleniyor...`} />;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-md ">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {`${ENTITY_HUMAN} Listesi`}
        </h1>
        <div className='bg-blue-200'></div>
        <div className='bg-red-200'></div>
      </div>

      <BirimDataTable
        data={data}
        isLoading={loadingList}
        onRefresh={handleRefreshData}
      // onRowClick={(item) => useSheetStore.getState().openSheet('detail', ENTITY_TYPE, item.id)}
      />

      <BirimCreateSheet />
      <BirimEditSheet />
      <BirimDeleteSheet />
      <BirimDetailSheet />
    </div>
  );
};
