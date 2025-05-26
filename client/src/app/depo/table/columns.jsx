import { HeaderButton } from '@/components/table/HeaderButton';
import { EntityHuman } from '../constants/api';

export const Depo_Columns = () => [
  {
    accessorKey: 'ad',
    header: ({ column }) => <HeaderButton column={column} title={`${EntityHuman} Adı`} />,
    cell: ({ row }) => {
      const ad = row.getValue('ad');
      return <div className="font-medium">{ad || '-'}</div>;
    },
    enableHiding: false,
    size: 250,
    meta: {
      exportHeader: `${EntityHuman} Adı`,
      filterVariant: 'text',
    },
  },
  {
    accessorKey: 'aciklama',
    header: ({ column }) => <HeaderButton column={column} title="Açıklama" />,
    cell: ({ row }) => {
      const aciklama = row.getValue('aciklama');
      return <div className="text-sm text-gray-600 truncate max-w-xs">{aciklama || '-'}</div>;
    },
    size: 300,
    meta: {
      exportHeader: 'Açıklama',
      filterVariant: 'text',
    },
  },
  {
    accessorKey: 'konumSayisi',
    accessorFn: row => row.konumlar?.length ?? 0,
    header: ({ column }) => <HeaderButton column={column} title="Konum Sayısı" />,
    cell: ({ row }) => {
      const konumSayisi = row.original.konumlar?.length ?? 0;
      return <div className="text-center w-20">{konumSayisi}</div>;
    },
    size: 10,
    enableSorting: true,
    meta: {
      exportHeader: 'Konum Sayısı',
      filterVariant: 'number',
    },
  },
];
