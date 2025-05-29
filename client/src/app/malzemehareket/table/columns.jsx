// client/src/app/malzemeHareket/table/columns.jsx
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { HeaderButton } from '@/components/table/HeaderButton';
import { Badge } from '@/components/ui/badge';
import { EntityHuman } from '../constants/api';
import { HareketTuruOptions, MalzemeKondisyonuOptions } from '../constants/schema';

export const MalzemeHareket_Columns = () => {
  const inArrayFilterFn = (row, columnId, filterValueArray) => {
    if (!filterValueArray || filterValueArray.length === 0) {
      return true;
    }
    const rowValue = row.getValue(columnId);
    return filterValueArray.includes(rowValue);
  };

  // Hareket türü renk eşlemeleri
  const getHareketTuruBadgeVariant = (hareketTuru) => {
    switch (hareketTuru) {
      case 'Zimmet': return 'default';
      case 'Iade': return 'secondary';
      case 'Devir': return 'outline';
      case 'DepoTransferi': return 'destructive';
      case 'Kayip': return 'destructive';
      case 'KondisyonGuncelleme': return 'warning_muted';
      case 'Kayit': return 'success_muted';
      case 'Dusum': return 'destructive_muted';
      default: return 'outline';
    }
  };

  // Kondisyon renk eşlemeleri
  const getKondisyonBadgeVariant = (kondisyon) => {
    switch (kondisyon) {
      case 'Saglam': return 'success_muted';
      case 'Arizali': return 'warning_muted';
      case 'Hurda': return 'destructive_muted';
      default: return 'outline';
    }
  };

  return [
    {
      accessorKey: 'islemTarihi',
      header: ({ column }) => <HeaderButton column={column} title="İşlem Tarihi" />,
      cell: ({ row }) => {
        const islemTarihi = row.getValue('islemTarihi');
        if (!islemTarihi) return '-';
        return (
          <div className="text-sm">
            {format(new Date(islemTarihi), 'dd.MM.yyyy', { locale: tr })}
            <div className="text-xs text-muted-foreground">
              {format(new Date(islemTarihi), 'HH:mm', { locale: tr })}
            </div>
          </div>
        );
      },
      enableHiding: false,
      size: 120,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: 'İşlem Tarihi',
        filterVariant: 'date',
      },
    },
    {
      accessorKey: 'hareketTuru',
      header: ({ column }) => <HeaderButton column={column} title="Hareket Türü" />,
      cell: ({ row }) => {
        const hareketTuru = row.getValue('hareketTuru');
        const hareketOption = HareketTuruOptions.find(option => option.value === hareketTuru);
        const label = hareketOption?.label || hareketTuru;
        
        return (
          <Badge variant={getHareketTuruBadgeVariant(hareketTuru)} className="text-xs">
            {label}
          </Badge>
        );
      },
      size: 150,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: 'Hareket Türü',
        filterVariant: 'select',
        filterOptions: HareketTuruOptions,
      },
    },
    {
      accessorKey: 'malzeme',
      accessorFn: row => row.malzeme?.vidaNo || row.malzeme?.sabitKodu?.ad || 'Bilinmeyen',
      header: ({ column }) => <HeaderButton column={column} title="Malzeme" />,
      cell: ({ row }) => {
        const malzeme = row.original.malzeme;
        if (!malzeme) return '-';
        
        return (
          <div className="max-w-xs">
            <div className="font-medium text-sm truncate">
              {malzeme.vidaNo || 'Vida No Yok'}
            </div>
            {malzeme.sabitKodu?.ad && (
              <div className="text-xs text-muted-foreground truncate">
                {malzeme.sabitKodu.ad}
              </div>
            )}
            {malzeme.marka?.ad && malzeme.model?.ad && (
              <div className="text-xs text-gray-500 truncate">
                {malzeme.marka.ad} - {malzeme.model.ad}
              </div>
            )}
          </div>
        );
      },
      size: 200,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: 'Malzeme',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'malzemeKondisyonu',
      header: ({ column }) => <HeaderButton column={column} title="Kondisyon" />,
      cell: ({ row }) => {
        const kondisyon = row.getValue('malzemeKondisyonu');
        const kondisyonOption = MalzemeKondisyonuOptions.find(option => option.value === kondisyon);
        const label = kondisyonOption?.label || kondisyon;
        
        return (
          <Badge variant={getKondisyonBadgeVariant(kondisyon)} className="text-xs">
            {label}
          </Badge>
        );
      },
      size: 100,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: 'Malzeme Kondisyonu',
        filterVariant: 'select',
        filterOptions: MalzemeKondisyonuOptions,
      },
    },
    {
      accessorKey: 'kaynakPersonel',
      accessorFn: row => row.kaynakPersonel?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Kaynak Personel" />,
      cell: ({ row }) => {
        const kaynakPersonel = row.original.kaynakPersonel;
        if (!kaynakPersonel) return '-';
        
        return (
          <div className="text-sm">
            <div className="font-medium">{kaynakPersonel.ad}</div>
            {kaynakPersonel.sicil && (
              <div className="text-xs text-muted-foreground">
                Sicil: {kaynakPersonel.sicil}
              </div>
            )}
          </div>
        );
      },
      size: 150,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: 'Kaynak Personel',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'hedefPersonel',
      accessorFn: row => row.hedefPersonel?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Hedef Personel" />,
      cell: ({ row }) => {
        const hedefPersonel = row.original.hedefPersonel;
        if (!hedefPersonel) return '-';
        
        return (
          <div className="text-sm">
            <div className="font-medium">{hedefPersonel.ad}</div>
            {hedefPersonel.sicil && (
              <div className="text-xs text-muted-foreground">
                Sicil: {hedefPersonel.sicil}
              </div>
            )}
          </div>
        );
      },
      size: 150,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: 'Hedef Personel',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'konum',
      accessorFn: row => row.konum?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Konum" />,
      cell: ({ row }) => {
        const konum = row.original.konum;
        if (!konum) return '-';
        
        return (
          <div className="text-sm">
            <div className="font-medium">{konum.ad}</div>
            {konum.depo?.ad && (
              <div className="text-xs text-muted-foreground">
                Depo: {konum.depo.ad}
              </div>
            )}
          </div>
        );
      },
      size: 130,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: 'Konum',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'aciklama',
      header: ({ column }) => <HeaderButton column={column} title="Açıklama" />,
      cell: ({ row }) => {
        const aciklama = row.getValue('aciklama');
        if (!aciklama) return '-';
        
        return (
          <div className="text-sm text-gray-600 truncate max-w-xs" title={aciklama}>
            {aciklama}
          </div>
        );
      },
      size: 200,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: 'Açıklama',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'createdBy',
      accessorFn: row => row.createdBy?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="İşlemi Yapan" />,
      cell: ({ row }) => {
        const createdBy = row.original.createdBy;
        if (!createdBy) return '-';
        
        return (
          <div className="text-sm">
            <div className="font-medium">{createdBy.ad}</div>
            {createdBy.sicil && (
              <div className="text-xs text-muted-foreground">
                {createdBy.sicil}
              </div>
            )}
          </div>
        );
      },
      size: 130,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: 'İşlemi Yapan',
        filterVariant: 'text',
      },
    },
  ];
};