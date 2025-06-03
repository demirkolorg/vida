import { HeaderButton } from '@/components/table/HeaderButton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EntityHuman } from '../constants/api';

export const Buro_Columns = () => {
  const inArrayFilterFn = (row, columnId, filterValueArray) => {
    // Eğer filtre için seçilmiş bir değer yoksa veya dizi boşsa,
    // bu filtre için tüm satırları geçir (true döndür)
    if (!filterValueArray || filterValueArray.length === 0) {
      return true;
    }
    const rowValue = row.getValue(columnId); // Satırın ilgili kolondaki değeri
    // Satırın değerinin, seçilen filtre değerleri dizisinde olup olmadığını kontrol et
    return filterValueArray.includes(rowValue);
  };

  // Statik şube filter options - bu DataTable render sırasında doldurulacak
  const subeFilterOptions = []; // Boş bırakıyoruz, DataTable'da doldurulacak

  return [
    {
      accessorKey: 'ad',
      header: ({ column }) => <HeaderButton column={column} title={`${EntityHuman} Adı`} />,
      cell: ({ row }) => {
        const ad = row.getValue('ad');
        return <div className="font-medium">{ad || '-'}</div>;
      },
      enableHiding: false,
      size: 220,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: `${EntityHuman} Adı`,
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'sube',
      accessorFn: row => row.sube?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Bağlı Şube" />,
      cell: ({ row }) => {
        const subeAd = row.original.sube?.ad;
        return subeAd ? (
          <Badge variant="outline" className="text-xs">
            {subeAd}
          </Badge>
        ) : (
          <div className="text-sm text-gray-500">-</div>
        );
      },
      filterFn: inArrayFilterFn,
      size: 180,
      meta: {
        exportHeader: 'Bağlı Şube',
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'amir',
      accessorFn: row => row.amir?.ad || row.amir?.sicil || '',
      header: ({ column }) => <HeaderButton column={column} title="Büro Amiri" />,
      cell: ({ row }) => {
        const amir = row.original.amir;
        if (!amir) {
          return <div className="text-sm text-gray-500">-</div>;
        }
        
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={amir.avatar || '/placeholder.png'} alt={amir.ad || 'Avatar'} />
              <AvatarFallback className="text-xs">{amir.ad?.substring(0, 1) || 'A'}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{amir.ad || amir.sicil}</span>
            {amir.unvan && (
              <Badge variant="secondary" className="text-xs">
                {amir.unvan}
              </Badge>
            )}
          </div>
        );
      },
      filterFn: inArrayFilterFn,
      size: 220,
      meta: {
        exportHeader: 'Büro Amiri',
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'personelSayisi',
      accessorFn: row => row.personeller?.length ?? 0,
      header: ({ column }) => <HeaderButton column={column} title="Personel Sayısı" />,
      cell: ({ row }) => {
        const personelSayisi = row.original.personeller?.length ?? 0;
        return (
          <div className="text-center w-24">
            <Badge variant={personelSayisi > 0 ? 'secondary' : 'outline'} className="text-xs">
              {personelSayisi}
            </Badge>
          </div>
        );
      },
      filterFn: inArrayFilterFn,
      size: 130,
      enableSorting: true,
      meta: {
        exportHeader: 'Personel Sayısı',
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
      filterFn: inArrayFilterFn,
      size: 130,
      enableSorting: true,
      meta: {
        exportHeader: 'Malzeme Sayısı',
        filterVariant: 'number',
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
      accessorKey: 'projeSayisi',
      accessorFn: row => row.projeler?.length ?? 0,
      header: ({ column }) => <HeaderButton column={column} title="Proje Sayısı" />,
      cell: ({ row }) => {
        const projeSayisi = row.original.projeler?.length ?? 0;
        return (
          <div className="text-center w-24">
            <Badge variant={projeSayisi > 0 ? 'success_muted' : 'outline'} className="text-xs">
              {projeSayisi}
            </Badge>
          </div>
        );
      },
      filterFn: inArrayFilterFn,
      size: 120,
      enableSorting: true,
      meta: {
        exportHeader: 'Proje Sayısı',
        filterVariant: 'number',
      },
    },
  ];
};