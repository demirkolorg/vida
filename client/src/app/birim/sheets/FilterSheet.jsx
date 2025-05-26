import { BaseFilterManagementSheet } from '@/components/sheets/BaseFilterManagementSheet'; 
import { EntityType ,EntityHuman} from '../constants/api';

export const FilterSheet = (props) => {
    const { table } = props;
    return (
        <BaseFilterManagementSheet
            sheetTypeIdentifier="filterManagement"
            entityType={EntityType} 
            table={table}
            title={`'${EntityHuman}' İçin Kayıtlı Filtreler`} 
            description="Kaydedilmiş filtrelerinizi yönetebilir, yenisini ekleyebilir veya uygulayabilirsiniz.v."
        />)
}
