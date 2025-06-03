import { HeaderButton } from '@/components/table/columns/HeaderButton';
import { EntityHuman } from '../constants/api';

export const SabitKodu_Columns = () => [
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
    accessorKey: 'malzemeSayisi',
    accessorFn: row => row.malzemeler?.length ?? 0,
    header: ({ column }) => <HeaderButton column={column} title="Malzeme Sayısı" />,
    cell: ({ row }) => {
      const malzemeSayisi = row.original.malzemeler?.length ?? 0;
      return <div className="text-center w-24">{malzemeSayisi}</div>;
    },
    size: 50,
    enableSorting: true,
    meta: {
      exportHeader: 'Malzeme Sayısı',
      filterVariant: 'number',
    },
  },
];
