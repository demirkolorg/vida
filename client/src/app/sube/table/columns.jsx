import { HeaderButton } from '@/components/table/HeaderButton';
import { Badge } from '@/components/ui/badge';
import { EntityHuman } from '../constants/api';

export const Sube_Columns = () => {
  // Statik birim filter options - bu DataTable render sırasında doldurulacak
  const birimFilterOptions = []; // Boş bırakıyoruz, DataTable'da doldurulacak

  return [
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
      accessorKey: 'birim',
      accessorFn: row => row.birim?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Bağlı Birim" />,
      cell: ({ row }) => {
        const birimAd = row.original.birim?.ad;
        return birimAd ? (
          <Badge variant="outline" className="text-xs">
            {birimAd}
          </Badge>
        ) : (
          <div className="text-sm text-gray-500">-</div>
        );
      },
      size: 200,
      meta: {
        exportHeader: 'Bağlı Birim',
        filterVariant: 'select',
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
      accessorKey: 'buroSayisi',
      accessorFn: row => row.burolar?.length ?? 0,
      header: ({ column }) => <HeaderButton column={column} title="Büro Sayısı" />,
      cell: ({ row }) => {
        const buroSayisi = row.original.burolar?.length ?? 0;
        return (
          <div className="text-center w-20">
            <Badge variant={buroSayisi > 0 ? 'secondary' : 'outline'} className="text-xs">
              {buroSayisi}
            </Badge>
          </div>
        );
      },
      size: 120,
      enableSorting: true,
      meta: {
        exportHeader: 'Büro Sayısı',
        filterVariant: 'number',
      },
    },
    {
      accessorKey: 'malzemeSayisi',
      accessorFn: row => row.malzemeler?.length ?? 0,
      header: ({ column }) => <HeaderButton column={column} title="Malzeme Sayısı" />,
      cell: ({ row }) => {
        const malzemeSayisi = row.original.malzemeler?.length ?? 0;
        return (
          <div className="text-center w-24">
            <Badge variant={malzemeSayisi > 0 ? 'secondary' : 'outline'} className="text-xs">
              {malzemeSayisi}
            </Badge>
          </div>
        );
      },
      size: 130,
      enableSorting: true,
      meta: {
        exportHeader: 'Malzeme Sayısı',
        filterVariant: 'number',
      },
    },
  ];
};