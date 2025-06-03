import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';

export function Audit_ContextMenu({ item }) {
  const menuTitle = item?.ad ? `${item.ad} ${EntityHuman} Kaydı` : `${EntityHuman} İşlemleri`;

  return <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle} hideEditButton={true} hideDeleteButton={true} hideStatusUpdateButton={true}></BaseContextMenu>;
}
