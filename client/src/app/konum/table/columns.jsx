import { HeaderButton } from '@/components/table/columns/HeaderButton';
import { Badge } from '@/components/ui/badge';
import { EntityHuman } from '../constants/api';

export const Konum_Columns = () => {
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
      accessorKey: 'depo',
      accessorFn: row => row.depo?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Bağlı Depo" />,
      cell: ({ row }) => {
        const depoAd = row.original.depo?.ad;
        return <div className="font-medium">{depoAd || '-'}</div>;
      },
      filterFn: inArrayFilterFn,
      size: 180,
      meta: {
        exportHeader: 'Bağlı Depo',
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'aciklama',
      header: ({ column }) => <HeaderButton column={column} title="Açıklama" />,
      cell: ({ row }) => {
        const aciklama = row.getValue('aciklama');
        return (
          <div className="text-sm text-gray-600 truncate max-w-xs" title={aciklama}>
            {aciklama || '-'}
          </div>
        );
      },
      filterFn: inArrayFilterFn,
      size: 300,
      meta: {
        exportHeader: 'Açıklama',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'malzemeHareketSayisi',
      accessorFn: row => row.malzemeHareketleri?.length ?? 0,
      header: ({ column }) => <HeaderButton column={column} title="Malzeme Hareket Sayısı" />,
      cell: ({ row }) => {
        const malzemeHareketSayisi = row.original.malzemeHareketleri?.length ?? 0;
        const hareketTurleri =
          row.original.malzemeHareketleri?.reduce((acc, hareket) => {
            acc[hareket.hareketTuru] = (acc[hareket.hareketTuru] || 0) + 1;
            return acc;
          }, {}) || {};

        const topHareketTuru = Object.keys(hareketTurleri).length > 0 ? Object.entries(hareketTurleri).sort(([, a], [, b]) => b - a)[0][0] : null;

        return (
          <div className="text-center w-20">
            <Badge variant={malzemeHareketSayisi > 0 ? 'secondary' : 'outline'} className="text-xs" title={topHareketTuru ? `En çok: ${topHareketTuru}` : 'Henüz hareket yok'}>
              {malzemeHareketSayisi}
            </Badge>
          </div>
        );
      },
      filterFn: inArrayFilterFn,
      size: 150,
      enableSorting: true,
      meta: {
        exportHeader: 'Malzeme Hareket Sayısı',
        filterVariant: 'number',
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <HeaderButton column={column} title="Oluşturulma Tarihi" />,
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt');
        if (!createdAt) return <div className="text-sm text-gray-500">-</div>;

        const date = new Date(createdAt);
        return <div className="text-sm text-gray-600">{date.toLocaleDateString('tr-TR')}</div>;
      },
      filterFn: inArrayFilterFn,
      size: 130,
      enableSorting: true,
      meta: {
        exportHeader: 'Oluşturulma Tarihi',
        filterVariant: 'date',
      },
    },
    {
      accessorKey: 'createdBy',
      accessorFn: row => row.createdBy?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Oluşturan" />,
      cell: ({ row }) => {
        const createdBy = row.original.createdBy;
        if (!createdBy) return <div className="text-sm text-gray-500">-</div>;

        return (
          <div className="flex items-center space-x-2">
            {createdBy.avatar && <img src={createdBy.avatar} alt={createdBy.ad || 'Avatar'} className="w-5 h-5 rounded-full" />}
            <span className="text-sm truncate max-w-24" title={createdBy.ad}>
              {createdBy.ad || createdBy.sicil || '-'}
            </span>
          </div>
        );
      },
      filterFn: inArrayFilterFn,
      size: 140,
      meta: {
        exportHeader: 'Oluşturan',
        filterVariant: 'select',
      },
    },
  ];
};
