import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { Audit_Store as EntityStore } from '../constants/store';
import { Audit_DetailSheet as EntityDetailSheet} from '../sheets/DetailSheet';
import { Audit_DataTable as EntityDataTable  } from '../table/dataTable';


export function Audit_ListPage() {
  return (
    <div className="mx-auto">
      <PageHeader EntityHuman={EntityHuman} useEntityStore={EntityStore} />
      <EntityDataTable/>
      <EntityDetailSheet />
    </div>
  );
}
