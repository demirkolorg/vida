import { HeaderButton } from '@/components/table/HeaderButton';
import { Badge } from '@/components/ui/badge';
import { EntityHuman } from '../constants/api';

export const Model_Columns = () => {
  const inArrayFilterFn = (row, columnId, filterValueArray) => {
    if (!filterValueArray || filterValueArray.length === 0) {
      return true;
    }
    const rowValue = row.getValue(columnId);
    return filterValueArray.includes(rowValue);
  };

  return [
    {
      accessorKey: 'ad',
      header: ({ column }) => <HeaderButton column={column} title={`${EntityHuman} Adı`} />,
      cell: ({ row }) => {
        const ad = row.getValue('ad');
        return <div className="font-medium">{ad || '-'}</div>;
      },
      enableHiding: false,
      size: 200,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: `${EntityHuman} Adı`,
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'marka',
      accessorFn: row => row.marka?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Bağlı Marka" />,
      cell: ({ row }) => {
        const markaAd = row.original.marka?.ad;
        return markaAd ? (
          <Badge variant="outline" className="text-xs">
            {markaAd}
          </Badge>
        ) : (
          <div className="text-sm text-gray-500">-</div>
        );
      },
      filterFn: inArrayFilterFn,
      size: 180,
      meta: {
        exportHeader: 'Bağlı Marka',
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
      filterFn: inArrayFilterFn,
      size: 250,
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
        return (
          <div className="text-center w-24">
            <Badge variant={malzemeSayisi > 0 ? 'secondary' : 'outline'} className="text-xs">
              {malzemeSayisi}
            </Badge>
          </div>
        );
      },
      filterFn: inArrayFilterFn,
      size: 120,
      enableSorting: true,
      meta: {
        exportHeader: 'Malzeme Sayısı',
        filterVariant: 'number',
      },
    },
  ];
};