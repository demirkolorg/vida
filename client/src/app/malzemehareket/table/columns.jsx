// client/src/app/malzemeHareket/table/columns.jsx
import { HeaderButton } from '@/components/table/HeaderButton';
import { Badge } from '@/components/ui/badge';
import { EntityHuman } from '../constants/api';
import { HareketTuruOptions, KondisyonOptions } from '../constants/schema';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { AvatarWithName } from "@/components/table/AvatarWithName";

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
      case 'Kayip':
        return 'destructive';
      case 'Dusum':
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
      size: 140,
      meta: {
        exportHeader: 'İşlem Tarihi',
        filterVariant: 'date',
      },
    },
    {
      accessorKey: 'malzeme',
      accessorFn: row => {
        const malzeme = row.malzeme;
        if (!malzeme) return '';
        const searchTerms = [
          malzeme.vidaNo,
          malzeme.sabitKodu?.ad,
          malzeme.marka?.ad,
          malzeme.model?.ad,
          malzeme.kod,
          malzeme.bademSeriNo,
          malzeme.etmysSeriNo,
          malzeme.stokDemirbasNo
        ].filter(Boolean);
        return searchTerms.join(' ');
      },
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
      size: 200,
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
      size: 120,
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
      size: 100,
      meta: {
        exportHeader: 'Kondisyon',
        filterVariant: 'select',
        filterOptions: KondisyonOptions,
      },
    },
    {
      accessorKey: 'kaynakPersonel',
      accessorFn: row => {
        const personel = row.kaynakPersonel;
        if (!personel) return '';
        const searchTerms = [
          personel.ad,
          personel.soyad,
          personel.sicil
        ].filter(Boolean);
        return searchTerms.join(' ');
      },
      header: ({ column }) => <HeaderButton column={column} title="Kaynak Personel" />,
      cell: ({ row }) => {
        const kaynak = row.original.kaynakPersonel;
        return kaynak ? <AvatarWithName user={kaynak} /> : <div className="text-sm text-muted-foreground">-</div>;
      },
      size: 150,
      meta: {
        exportHeader: 'Kaynak Personel',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'hedefPersonel',
      accessorFn: row => {
        const personel = row.hedefPersonel;
        if (!personel) return '';
        const searchTerms = [
          personel.ad,
          personel.soyad,
          personel.sicil
        ].filter(Boolean);
        return searchTerms.join(' ');
      },
      header: ({ column }) => <HeaderButton column={column} title="Hedef Personel" />,
      cell: ({ row }) => {
        const hedef = row.original.hedefPersonel;
        return hedef ? <AvatarWithName user={hedef} /> : <div className="text-sm text-muted-foreground">-</div>;
      },
      size: 150,
      meta: {
        exportHeader: 'Hedef Personel',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'kaynakKonum',
      accessorFn: row => {
        const konum = row.kaynakKonum;
        if (!konum) return '';
        const searchTerms = [
          konum.ad,
          konum.depo?.ad
        ].filter(Boolean);
        return searchTerms.join(' - ');
      },
      header: ({ column }) => <HeaderButton column={column} title="Kaynak Konum" />,
      cell: ({ row }) => {
        const kaynakKonum = row.original.kaynakKonum;
        return kaynakKonum ? (
          <div className="space-y-1">
            <div className="text-sm font-medium">{kaynakKonum.ad}</div>
            {kaynakKonum.depo?.ad && <div className="text-xs text-muted-foreground">{kaynakKonum.depo.ad}</div>}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        );
      },
      size: 150,
      meta: {
        exportHeader: 'Kaynak Konum',
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'hedefKonum',
      accessorFn: row => {
        const konum = row.hedefKonum;
        if (!konum) return '';
        const searchTerms = [
          konum.ad,
          konum.depo?.ad
        ].filter(Boolean);
        return searchTerms.join(' - ');
      },
      header: ({ column }) => <HeaderButton column={column} title="Hedef Konum" />,
      cell: ({ row }) => {
        const hedefKonum = row.original.hedefKonum;
        return hedefKonum ? (
          <div className="space-y-1">
            <div className="text-sm font-medium">{hedefKonum.ad}</div>
            {hedefKonum.depo?.ad && <div className="text-xs text-muted-foreground">{hedefKonum.depo.ad}</div>}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        );
      },
      size: 150,
      meta: {
        exportHeader: 'Hedef Konum',
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
      size: 200,
      meta: {
        exportHeader: 'Açıklama',
        filterVariant: 'text',
      },
    },
   
  ];
};