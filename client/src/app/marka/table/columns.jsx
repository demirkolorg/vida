import { HeaderButton } from '@/components/table/HeaderButton';
import { EntityHuman } from '../constants/api';

export const Marka_Columns = () => [
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
    accessorKey: 'subeSayisi',
    accessorFn: row => row.subeler?.length ?? 0,
    header: ({ column }) => <HeaderButton column={column} title="Şube Sayısı" />,
    cell: ({ row }) => {
      const subeSayisi = row.original.subeler?.length ?? 0;
      return <div className="text-center w-20">{subeSayisi}</div>;
    },
    size: 10,
    enableSorting: true,
    meta: {
      exportHeader: 'Şube Sayısı',
      filterVariant: 'number',
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
  {
    accessorKey: 'modelSayisi',
    accessorFn: row => row.modeller?.length ?? 0,
    header: ({ column }) => <HeaderButton column={column} title="Model Sayısı" />,
    cell: ({ row }) => {
      const modelSayisi = row.original.modeller?.length ?? 0;
      return <div className="text-center w-24">{modelSayisi}</div>;
    },
    size: 50,
    enableSorting: true,
    meta: {
      exportHeader: 'Model Sayısı',
      filterVariant: 'number',
    },
  },
];
