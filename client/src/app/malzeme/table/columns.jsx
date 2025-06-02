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
      accessorKey: 'vidaNo',
      header: ({ column }) => <HeaderButton column={column} title="Vida No" />,
      cell: ({ row }) => {
        const vidaNo = row.getValue('vidaNo');
        return (
          <div className="font-mono text-sm">
            {vidaNo ? (
              <Badge variant="outline" className="font-mono">
                {vidaNo}
              </Badge>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        );
      },
      enableHiding: false,
      size: 150,
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
        return (
          <div className="font-mono text-xs">
            {kod ? (
              <Badge variant="outline" className="font-mono">
                {kod}
              </Badge>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        );
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
        return (
          <div className="font-mono text-xs">
            {bademSeriNo ? (
              <Badge variant="outline" className="font-mono">
                {bademSeriNo}
              </Badge>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        );
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
        return (
          <div className="font-mono text-xs">
            {etmysSeriNo ? (
              <Badge variant="outline" className="font-mono">
                {etmysSeriNo}
              </Badge>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        );
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
        return (
          <div className="font-mono text-xs">
            {stokDemirbasNo ? (
              <Badge variant="outline" className="font-mono">
                {stokDemirbasNo}
              </Badge>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        );
      },
      filterFn: inArrayFilterFn,
      size: 150,
      meta: {
        exportHeader: 'Stok/Demirbaş No',
        filterVariant: 'text',
      },
    },
    
    {
      accessorKey: 'malzemeTipi',
      header: ({ column }) => <HeaderButton column={column} title="Malzeme Tipi" />,
      cell: ({ row }) => {
        const malzemeTipi = row.getValue('malzemeTipi');
        return (
          <Badge variant={malzemeTipi === 'Demirbas' ? 'default' : 'secondary'} className="text-xs">
            {malzemeTipi || '-'}
          </Badge>
        );
      },
      filterFn: inArrayFilterFn,
      size: 120,
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
      accessorKey: 'sabitKodu',
      accessorFn: row => row.sabitKodu?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Sabit Kodu" />,
      cell: ({ row }) => {
        const sabitKodu = row.original.sabitKodu;
        return sabitKodu ? <div className="font-medium text-sm">{sabitKodu.ad}</div> : <span className="text-muted-foreground text-sm">-</span>;
      },
      filterFn: inArrayFilterFn,
      size: 160,
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
      size: 120,
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
      size: 120,
      meta: {
        exportHeader: 'Model',
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'birim',
      accessorFn: row => row.birim?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Kuvve Birimi" />,
      cell: ({ row }) => {
        const birim = row.original.birim;
        return birim ? <div className="font-medium text-sm">{birim.ad}</div> : <span className="text-muted-foreground text-sm">-</span>;
      },
      filterFn: inArrayFilterFn,
      size: 150,
      meta: {
        exportHeader: 'Kuvve Birimi',
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'sube',
      accessorFn: row => row.sube?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="İş Karşılığı Şube" />,
      cell: ({ row }) => {
        const sube = row.original.sube;
        return sube ? <div className="font-medium text-sm">{sube.ad}</div> : <span className="text-muted-foreground text-sm">-</span>;
      },
      filterFn: inArrayFilterFn,
      size: 170,
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
        if (row.malzemeHareketleri && row.malzemeHareketleri.length > 0) {
          return row.malzemeHareketleri[0].hareketTuru || '';
        }
        return '';
      },
      header: ({ column }) => <HeaderButton column={column} title="Son Hareketi" />,
      cell: ({ row }) => {
        const sonHareketiAnlamli = anlamliSonHareketi(row?.original);
        const hareketTuru = sonHareketiAnlamli?.hareketTuru;
        const label = hareketTuruLabels[hareketTuru] ?? hareketTuru;
        return hareketTuru ? <div className="font-medium text-sm">{label}</div> : <span className="text-muted-foreground text-sm">-</span>;
      },
      filterFn: inArrayFilterFn,
      size: 120,
      meta: {
        exportHeader: 'Son Hareketi',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'zimmetOzet',
      accessorFn: row => {
        if (row.malzemeHareketleri && row.malzemeHareketleri.length > 0) {
          return row.malzemeHareketleri[0].hareketTuru || '';
        }
        return '';
      },
      header: ({ column }) => <HeaderButton column={column} title="Özet" />,
      cell: ({ row }) => {
        const depoda = malzemeDepoda(row?.original);
        const personelde = malzemePersonelde(row?.original);
        let text = '';
        if (depoda) text = 'Depoda';
        if (personelde) text = 'Personelde';
        return <div className="font-medium text-sm">{text}</div>;
      },
      filterFn: inArrayFilterFn,
      size: 120,
      meta: {
        exportHeader: 'Son Hareketi',
        filterVariant: 'text',
      },
    },
  ];
};
