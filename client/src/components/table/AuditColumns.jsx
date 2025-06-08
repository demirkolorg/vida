import React from 'react';
import { HeaderButton } from '@/components/table/HeaderButton';
import { AvatarWithName } from '@/components/table/AvatarWithName';
import { turkishCaseInsensitiveFilterFn } from '@/components/table/Functions';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { statusStyles } from '@/components/table/Functions';
import { EntityStatusOptionsArray } from '@/constants/statusOptions';

const StatusCell = ({ status }) => {
  return (
    <Badge variant="outline" className={`${statusStyles[status] || 'bg-gray-500'} text-white text-xs`}>
      {status || '-'}
    </Badge>
  );
};

export const AuditColumns = () => [
  {
    accessorKey: 'status',
    header: ({ column }) => <HeaderButton column={column} title="Durum" />,
    cell: ({ row }) => {
      const status = row.getValue('status');
      return <StatusCell status={status} />;
    },
    size: 100,
    // enableHiding: false,
    enableSorting: true,
    meta: {
      exportHeader: 'Durum',
      filterVariant: 'select',
      filterOptions: EntityStatusOptionsArray,
    },
  },
  {
    accessorKey: 'createdBy',
    header: ({ column }) => <HeaderButton column={column} title="Oluşturan" />,
    cell: ({ row }) => {
      const createdByPersonel = row.original.createdBy; // Tip ataması kaldırıldı
      if (!createdByPersonel) return '-';
      return <AvatarWithName user={createdByPersonel} />;
    },
    accessorFn: row => row.createdBy?.ad, // Tip ataması kaldırıldı, opsiyonel zincirleme korundu
    filterFn: turkishCaseInsensitiveFilterFn,
    size: 200,
    enableHiding: true,
    meta: {
      exportHeader: 'Oluşturan',
      filterVariant: 'text',
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <HeaderButton column={column} title="Oluşturulma Tarihi" />,
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      if (!createdAt) return '-';
      try {
        return <div className="text-sm">{format(new Date(createdAt), 'dd MMM yyyy, HH:mm', { locale: tr })}</div>;
      } catch (e) {
        console.error('createdAt format error:', e, createdAt);
        return <div className="text-sm text-red-500">Geçersiz Tarih</div>;
      }
    },
    size: 180,
    enableHiding: true,
    meta: {
      exportHeader: 'Oluşturulma Tarihi',
      filterVariant: 'date',
    },
  },
  {
    accessorKey: 'updatedBy',
    header: ({ column }) => <HeaderButton column={column} title="Düzenleyen" />,
    cell: ({ row }) => {
      const updatedByPersonel = row.original.updatedBy; // Tip ataması kaldırıldı
      if (!updatedByPersonel) return '-';
      return <AvatarWithName user={updatedByPersonel} />;
    },
    accessorFn: row => row.updatedBy?.ad, // Tip ataması kaldırıldı, opsiyonel zincirleme korundu
    filterFn: turkishCaseInsensitiveFilterFn,
    size: 200,
    enableHiding: true,
    meta: {
      exportHeader: 'Düzenleyen',
      filterVariant: 'text',
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <HeaderButton column={column} title="Düzenleme Tarihi" />,
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      if (!updatedAt) return '-';
      try {
        return <div className="text-sm">{format(new Date(updatedAt), 'dd MMM yyyy, HH:mm', { locale: tr })}</div>;
      } catch (e) {
        console.error('updatedAt format error:', e, updatedAt);
        return <div className="text-sm text-red-500">Geçersiz Tarih</div>;
      }
    },
    size: 180,
    enableHiding: true,
    meta: {
      exportHeader: 'Düzenleme Tarihi',
      filterVariant: 'date',
    },
  },
];
