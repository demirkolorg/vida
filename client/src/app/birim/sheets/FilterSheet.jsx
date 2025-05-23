import { BaseFilterManagementSheet } from '@/components/sheets/BaseFilterManagementSheet'; // Yeni oluşturduğumuz base sheet
import { EntityType ,EntityHuman} from '../constants/api';

export const FilterSheet = (props) => {
    const { table } = props; // DataTable'dan gelen tablo instance'ı
    return (
        <BaseFilterManagementSheet
            sheetTypeIdentifier="filterManagement" // sheetStore'da tanımladığımız tip
            entityType={EntityType} // Bu sayfanın varlık tipi (örn: "birim")
            table={table} // DataTable'dan gelen table instance'ı
            title={`'${EntityHuman}' İçin Kayıtlı Filtreler`} // EntityHumanName, store veya api dosyasından gelebilir
            description="Kaydedilmiş filtrelerinizi yönetebilir, yenisini ekleyebilir veya uygulayabilirsiniz."
        />)
}
