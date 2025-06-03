// client/src/app/malzemeHareket/table/columns.jsx
import { HeaderButton } from '@/components/table/columns/HeaderButton';
import { Badge } from '@/components/ui/badge';
import { EntityHuman } from '../constants/api';
import { HareketTuruOptions, KondisyonOptions } from '../constants/schema';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { AvatarWithName } from "@/components/table/columns/AvatarWithName";

export const MalzemeHareket_Columns = () => {
  // Hareket türü renk kodları
  const getHareketTuruVariant = hareketTuru => {
    switch (hareketTuru) {
      case 'Kayit':
        return 'default';
      case 'Zimmet':
        return 'destructive';
      case 'Iade':
        return 'success';
      case 'Devir':
        return 'warning';
      case 'DepoTransferi':
        return 'secondary';
      case 'KondisyonGuncelleme':
        return 'outline';
      case 'Kayip':
        return 'destructive';
      case 'Dusum':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Kondisyon renk kodları
  const getKondisyonVariant = kondisyon => {
    switch (kondisyon) {
      case 'Saglam':
        return 'success';
      case 'Arizali':
        return 'warning';
      case 'Hurda':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return [
    {
      accessorKey: 'islemTarihi',
      header: ({ column }) => <HeaderButton column={column} title="İşlem Tarihi" />,
      cell: ({ row }) => {
        const tarih = row.getValue('islemTarihi');
        return <div className="text-sm">{tarih ? format(new Date(tarih), 'dd.MM.yyyy HH:mm', { locale: tr }) : '-'}</div>;
      },
      // size: 140,
      meta: {
        exportHeader: 'İşlem Tarihi',
        filterVariant: 'date',
      },
    },
    {
      accessorKey: 'malzeme',
      accessorFn: row => row.malzeme?.vidaNo && row.malzeme?.sabitKodu?.ad && row?.malzeme.marka.ad && row.malzeme.model.ad,
      header: ({ column }) => <HeaderButton column={column} title="Malzeme" />,
      cell: ({ row }) => {
        const malzeme = row.original.malzeme;
        return (
          <div className="space-y-1">
            <div className="font-medium text-sm">{malzeme?.vidaNo || '-'}</div>
            <div className="text-xs text-muted-foreground">{malzeme?.sabitKodu?.ad || '-'}</div>
            {malzeme?.marka?.ad && malzeme?.model?.ad && (
              <div className="text-xs text-muted-foreground">
                {malzeme.marka.ad} - {malzeme.model.ad}
              </div>
            )}
          </div>
        );
      },
      // size: 200,
      meta: {
        exportHeader: 'Malzeme',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'hareketTuru',
      header: ({ column }) => <HeaderButton column={column} title="Hareket Türü" />,
      cell: ({ row }) => {
        const hareketTuru = row.getValue('hareketTuru');
        const option = HareketTuruOptions.find(opt => opt.value === hareketTuru);
        return (
          <Badge variant={getHareketTuruVariant(hareketTuru)} className="text-xs">
            {option?.label || hareketTuru}
          </Badge>
        );
      },
      // size: 120,
      meta: {
        exportHeader: 'Hareket Türü',
        filterVariant: 'select',
        filterOptions: HareketTuruOptions,
      },
    },
    {
      accessorKey: 'malzemeKondisyonu',
      header: ({ column }) => <HeaderButton column={column} title="Kondisyon" />,
      cell: ({ row }) => {
        const kondisyon = row.getValue('malzemeKondisyonu');
        const option = KondisyonOptions.find(opt => opt.value === kondisyon);
        return (
          <Badge variant={getKondisyonVariant(kondisyon)} className="text-xs">
            {option?.label || kondisyon}
          </Badge>
        );
      },
      // size: 100,
      meta: {
        exportHeader: 'Kondisyon',
        filterVariant: 'select',
        filterOptions: KondisyonOptions,
      },
    },
    {
      accessorKey: 'kaynakPersonel',
      accessorFn: row => row.kaynakPersonel?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Kaynak Personel" />,
      cell: ({ row }) => {
        const kaynak = row.original.kaynakPersonel;
        return kaynak ? <AvatarWithName name={kaynak.ad ||'Bilinmiyor'} sicil={kaynak.sicil || 'Bilinmiyor'} avatar={kaynak.avatar} subText={kaynak.sicil} /> : <div className="text-sm text-muted-foreground">-</div>;
      },
      // size: 150,
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
        const hedef = row.original.hedefPersonel;
        return hedef ? <AvatarWithName name={hedef.ad || hedef.sicil || 'Bilinmiyor'} sicil={hedef.sicil || 'Bilinmiyor'} avatar={hedef.avatar} subText={hedef.sicil} /> : <div className="text-sm text-muted-foreground">-</div>;
      },
      // size: 150,
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
        return konum ? (
          <div className="space-y-1">
            <div className="text-sm font-medium">{konum.ad}</div>
            {konum.depo?.ad && <div className="text-xs text-muted-foreground">{konum.depo.ad}</div>}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        );
      },
      // size: 150,
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
        return (
          <div className="text-sm text-gray-600 truncate max-w-xs" title={aciklama}>
            {aciklama || '-'}
          </div>
        );
      },
      // size: 200,
      meta: {
        exportHeader: 'Açıklama',
        filterVariant: 'text',
      },
    },
  ];
};
