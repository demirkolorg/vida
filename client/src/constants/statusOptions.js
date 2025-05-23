import { AuditStatusEnum } from '@prisma/client';

// const OriginalAuditStatusEnum = AuditStatusEnum;
// const { Silindi, ...FilteredStatusEnum } = OriginalAuditStatusEnum;
// export const EntityStatusOptions = FilteredStatusEnum;

// export const EntityStatusOptions = ['Aktif', 'Pasif', 'Silindi'];
// export const EntityStatusOptions ={Aktif: 'Aktif', Pasif: 'Pasif', Silindi: 'Silindi'};

export const EntityStatusOptions = AuditStatusEnum;
export const EntityStatusOptionsArray = Object.values(AuditStatusEnum).map(val => ({
    label: val,
    value: val
}));
