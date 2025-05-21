import { useCallback, useEffect } from 'react';
import { Spinner } from '@/components/general/Spinner';
import { useBirimStore } from '../constants/store';
import { BirimCreateSheet } from '../sheets/CreateSheet';
import { BirimEditSheet } from '../sheets/EditSheet';
import { BirimDeleteSheet } from '../sheets/DeleteSheet';
import { BirimDetailSheet } from '../sheets/DetailSheet';
import { BirimDataTable } from '../table/dataTable';
import { EntityHuman } from '../constants/api';
import { StatusDialog } from '../dialogs/StatusDialog';
import { EntityStatusOptions } from '@/constants/statusOptions';

export function BirimListPage() {
  const data = useBirimStore(state => state.datas);
  const fetchDataWithQuery = useBirimStore(state => state.FetchAll); // Yeniden adlandırdım
  const loadingList = useBirimStore(state => state.loadingList);
  const currentDataListType = useBirimStore(state => state.dataListType);
  const setDataListTypeAction = useBirimStore(state => state.SetDataListType);

  useEffect(() => {
    const statusToFetch = currentDataListType || EntityStatusOptions.Aktif; // Eğer null ise Aktifleri çek
    fetchDataWithQuery({ status: statusToFetch }, { showToast: false, force: true });
  }, [currentDataListType, fetchDataWithQuery]); // Bağımlılıklar doğru

  const handleRefreshData = useCallback(() => {
    const statusToRefresh = currentDataListType || EntityStatusOptions.Aktif;
    fetchDataWithQuery({ status: statusToRefresh }, { showToast: true, force: true });
  }, [fetchDataWithQuery, currentDataListType]);

  const toggleStatusRecord = useCallback(() => {
    const currentTypeOrDefault = currentDataListType || EntityStatusOptions.Aktif;
    const nextDataListType = currentTypeOrDefault === EntityStatusOptions.Aktif ? EntityStatusOptions.Pasif : EntityStatusOptions.Aktif;
    setDataListTypeAction(nextDataListType);
  }, [currentDataListType, setDataListTypeAction]); // fetchDataWithQuery bağımlılıktan çıkarıldı

  const listTitle = currentDataListType === EntityStatusOptions.Pasif ? `${EntityHuman} Listesi (Pasif Kayıtlar)` : `${EntityHuman} Listesi`;
  const toggleButtonText = currentDataListType === EntityStatusOptions.Aktif || !currentDataListType ? `Pasif Kayıtları Göster` : `Aktif Kayıtları Göster`;

  if (loadingList && data.length === 0 && !currentDataListType) {
    return <Spinner wText text={`${EntityHuman} listesi yükleniyor...`} />;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-md ">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{listTitle}</h1>
        <div className="bg-blue-200"></div>
        <div className="bg-red-200"></div>
      </div>

      <BirimDataTable data={data} isLoading={loadingList} onRefresh={handleRefreshData} onToggleStatus={toggleStatusRecord} />
      <BirimCreateSheet />
      <BirimEditSheet />
      <BirimDeleteSheet />
      <BirimDetailSheet />
      <StatusDialog />
    </div>
  );
}
