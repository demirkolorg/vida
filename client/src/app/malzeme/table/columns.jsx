import { HeaderButton } from '@/components/table/HeaderButton';
import { Badge } from '@/components/ui/badge';
import { anlamliSonHareketi, malzemePersonelde, malzemeDepoda } from '@/app/malzeme/helpers/hareketKarar';
import { hareketTuruLabels } from '@/app/malzemehareket/constants/hareketTuruEnum';

export const Malzeme_Columns = () => {
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

  return [
    {
      accessorKey: 'malzemeTipi',
      header: ({ column }) => <HeaderButton column={column} title="Malzeme Tipi" />,
      cell: ({ row }) => {
        const malzemeTipi = row.getValue('malzemeTipi');
        const getMalzemeTipiClassName = malzemeTipi => {
          const baseClass = 'font-medium text-sm';
          switch (malzemeTipi) {
            case 'Demirbas':
              return `${baseClass} text-primary/70 `;
            case 'Sarf':
              return `${baseClass} text-secondary`;
            default:
              return `${baseClass} text-gray-700`;
          }
        };

        return <div className={getMalzemeTipiClassName(malzemeTipi)}>{malzemeTipi}</div>;
      },
      filterFn: inArrayFilterFn,
      size: 90,
      meta: {
        exportHeader: 'Malzeme Tipi',
        filterVariant: 'select',
        filterOptions: [
          { label: 'Demirbaş', value: 'Demirbas' },
          { label: 'Sarf', value: 'Sarf' },
        ],
      },
    },
    {
      accessorKey: 'vidaNo',
      header: ({ column }) => <HeaderButton column={column} title="Vida No" />,
      cell: ({ row }) => {
        const vidaNo = row.getValue('vidaNo');
        return <div className="font-mono text-sm">{vidaNo ? vidaNo : <span className="text-muted-foreground">-</span>}</div>;
      },
      enableHiding: false,
      size: 100,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: 'Vida No',
        filterVariant: 'text',
      },
    },

    {
      accessorKey: 'kod',
      header: ({ column }) => <HeaderButton column={column} title="Kod" />,
      cell: ({ row }) => {
        const kod = row.getValue('kod');
        return <div className="font-mono text-sm">{kod ? kod : <span className="text-muted-foreground">-</span>}</div>;
      },
      filterFn: inArrayFilterFn,
      size: 150,
      meta: {
        exportHeader: 'Kod',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'bademSeriNo',
      header: ({ column }) => <HeaderButton column={column} title="Badem Seri No" />,
      cell: ({ row }) => {
        const bademSeriNo = row.getValue('bademSeriNo');
        return <div className="font-mono text-sm">{bademSeriNo ? bademSeriNo : <span className="text-muted-foreground">-</span>}</div>;
      },
      filterFn: inArrayFilterFn,
      size: 150,
      meta: {
        exportHeader: 'Badem Seri No',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'etmysSeriNo',
      header: ({ column }) => <HeaderButton column={column} title="ETMYS Seri No" />,
      cell: ({ row }) => {
        const etmysSeriNo = row.getValue('etmysSeriNo');
        return <div className="font-mono text-sm">{etmysSeriNo ? etmysSeriNo : <span className="text-muted-foreground">-</span>}</div>;
      },
      filterFn: inArrayFilterFn,
      size: 150,
      meta: {
        exportHeader: 'ETMYS Seri No',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'stokDemirbasNo',
      header: ({ column }) => <HeaderButton column={column} title="Stok/Demirbaş No" />,
      cell: ({ row }) => {
        const stokDemirbasNo = row.getValue('stokDemirbasNo');
        return <div className="font-mono text-sm">{stokDemirbasNo ? stokDemirbasNo : <span className="text-muted-foreground">-</span>}</div>;
      },
      filterFn: inArrayFilterFn,
      size: 150,
      meta: {
        exportHeader: 'Stok/Demirbaş No',
        filterVariant: 'text',
      },
    },

    {
      accessorKey: 'sabitKodu',
      accessorFn: row => row.sabitKodu?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Sabit Kodu" />,
      cell: ({ row }) => {
        const sabitKodu = row.original.sabitKodu;
        return sabitKodu ? <div className="font-medium text-sm">{sabitKodu.ad}</div> : <span className="text-muted-foreground text-sm">-</span>;
      },
      filterFn: inArrayFilterFn,
      size: 200,
      meta: {
        exportHeader: 'Sabit Kodu',
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'marka',
      accessorFn: row => row.marka?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Marka" />,
      cell: ({ row }) => {
        const marka = row.original.marka;
        return marka ? <div className="font-medium text-sm">{marka.ad}</div> : <span className="text-muted-foreground text-sm">-</span>;
      },
      filterFn: inArrayFilterFn,
      size: 150,
      meta: {
        exportHeader: 'Marka',
        filterVariant: 'select',
      },
    },

    {
      accessorKey: 'model',
      accessorFn: row => row.model?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Model" />,
      cell: ({ row }) => {
        const model = row.original.model;
        return model ? <div className="text-sm">{model.ad}</div> : <span className="text-muted-foreground text-sm">-</span>;
      },
      filterFn: inArrayFilterFn,
      size: 150,
      meta: {
        exportHeader: 'Model',
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'birim',
      accessorFn: row => row.birim?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Kuvvesi" />,
      cell: ({ row }) => {
        const birim = row.original.birim;
        return birim ? <div className="font-medium text-sm">{birim.ad}</div> : <span className="text-muted-foreground text-sm">-</span>;
      },
      filterFn: inArrayFilterFn,
      size: 100,
      meta: {
        exportHeader: 'Kuvve Birimi',
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'sube',
      accessorFn: row => row.sube?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Şubesi" />,
      cell: ({ row }) => {
        const sube = row.original.sube;
        return sube ? <div className="font-medium text-sm">{sube.ad}</div> : <span className="text-muted-foreground text-sm">-</span>;
      },
      filterFn: inArrayFilterFn,
      size: 100,
      meta: {
        exportHeader: 'İş Karşılığı Şube',
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'kayitTarihi',
      header: ({ column }) => <HeaderButton column={column} title="Kayıt Tarihi" />,
      cell: ({ row }) => {
        const kayitTarihi = row.getValue('kayitTarihi');
        if (!kayitTarihi) return <span className="text-muted-foreground text-sm">-</span>;

        const date = new Date(kayitTarihi);
        return <div className="text-sm">{date.toLocaleDateString('tr-TR')}</div>;
      },
      filterFn: inArrayFilterFn,
      size: 120,
      meta: {
        exportHeader: 'Kayıt Tarihi',
        filterVariant: 'date',
      },
    },

    {
      accessorKey: 'sonHareketTuru',
      accessorFn: row => {
        const sonHareket = anlamliSonHareketi(row);
        return sonHareket?.hareketTuru || '';
      },
      header: ({ column }) => <HeaderButton column={column} title="Son Hareket Türü" />,
      cell: ({ row }) => {
        const sonHareket = anlamliSonHareketi(row.original);
        const hareketTuru = sonHareket?.hareketTuru;

        if (!hareketTuru) {
          return <span className="text-muted-foreground text-sm">-</span>;
        }

        const label = hareketTuruLabels[hareketTuru] ?? hareketTuru;

        // Hareket türüne göre renk kodlaması
        const getHareketClassName = tur => {
          const baseClass = 'font-medium text-sm';
          switch (tur) {
            case 'Zimmet':
              return `${baseClass} text-green-700`;
            case 'Iade':
              return `${baseClass} text-blue-700`;
            case 'Devir':
              return `${baseClass} text-orange-700`;
            case 'Kayıp':
              return `${baseClass} text-red-700`;
            case 'Düşüm':
              return `${baseClass} text-purple-700`;
            case 'Kayıt':
              return `${baseClass}  text-cyan-700`;
            case 'Depo Transferi':
              return `${baseClass}  text-yellow-700`;
            case 'Kondisyon Güncelleme':
              return `${baseClass}  text-gray-700`;
            default:
              return `${baseClass} text-gray-700`;
          }
        };

        return <div className={getHareketClassName(hareketTuru)}>{label}</div>;
      },
      filterFn: inArrayFilterFn,
      size: 140,
      enableSorting: true,
      meta: {
        exportHeader: 'Son Hareket Türü',
        filterVariant: 'select',
        filterOptions: Object.entries(hareketTuruLabels || {}).map(([value, label]) => ({
          label,
          value,
        })),
      },
    },
    {
      accessorKey: 'zimmetOzet',
      accessorFn: row => {
        const depoda = malzemeDepoda(row);
        const personelde = malzemePersonelde(row);

        if (depoda) return 'Depoda';
        if (personelde) return 'Personelde';
        return 'Bilinmiyor';
      },
      header: ({ column }) => <HeaderButton column={column} title="Zimmet Durumu" />,
      cell: ({ row }) => {
        const depoda = malzemeDepoda(row.original);
        const personelde = malzemePersonelde(row.original);

        let text = 'Bilinmiyor';
        let className = 'font-medium text-sm text-gray-700';

        if (depoda) {
          text = 'Depoda';
          className = 'font-medium text-sm text-blue-700';
        } else if (personelde) {
          text = 'Personelde';
          className = 'font-medium text-sm text-green-700';
        }

        return <div className={className}>{text}</div>;
      },
      filterFn: inArrayFilterFn,
      size: 120,
      enableSorting: true,
      meta: {
        exportHeader: 'Zimmet Durumu',
        filterVariant: 'select',
        filterOptions: [
          { label: 'Depoda', value: 'Depoda' },
          { label: 'Personelde', value: 'Personelde' },
          { label: 'Bilinmiyor', value: 'Bilinmiyor' },
        ],
      },
    },
    {
      accessorKey: 'kondisyon',
      accessorFn: row => {
        if (row.malzemeHareketleri && row.malzemeHareketleri.length > 0) {
          return row.malzemeHareketleri[0].malzemeKondisyonu || '';
        }
        return '';
      },
      header: ({ column }) => <HeaderButton column={column} title="Kondisyon" />,
      cell: ({ row }) => {
        const kondisyon = row?.original?.malzemeHareketleri?.[0]?.malzemeKondisyonu;
        return <div className="font-medium text-sm">{kondisyon}</div>;
      },
      filterFn: inArrayFilterFn,
      size: 100,
      meta: {
        exportHeader: 'Son Hareketi',
        filterVariant: 'text',
      },
    },
  ];
};
