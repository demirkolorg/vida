import { HeaderButton } from '@/components/table/HeaderButton';
import { Badge } from '@/components/ui/badge';
import { AvatarWithName } from '@/components/table/AvatarWithName';

export const Tutanak_Columns = () => [
  {
    accessorKey: 'tutanakId',
    header: ({ column }) => <HeaderButton column={column} title="Tutanak No" />,
    cell: ({ row }) => {
      const tutanakNo = row.original?.id;
      return <div className="font-medium font-mono text-sm">{tutanakNo || '-'}</div>;
    },
    enableHiding: false,
    size: 200,
    meta: {
      exportHeader: 'Tutanak No',
      filterVariant: 'text',
    },
  },
  {
    accessorKey: 'hareketTuru', // tutanakTuru yerine hareketTuru
    header: ({ column }) => <HeaderButton column={column} title="Hareket Türü" />,
    cell: ({ row }) => {
      const hareketTuru = row.getValue('hareketTuru');
      const colorMap = {
        Zimmet: 'bg-blue-100 text-blue-800',
        Iade: 'bg-green-100 text-green-800',
        Devir: 'bg-purple-100 text-purple-800',
        DepoTransferi: 'bg-orange-100 text-orange-800',
        KondisyonGuncelleme: 'bg-yellow-100 text-yellow-800',
        Kayip: 'bg-red-100 text-red-800',
        Dusum: 'bg-gray-100 text-gray-800',
        Kayit: 'bg-cyan-100 text-cyan-800',
      };

      const labelMap = {
        Zimmet: 'Zimmet',
        Iade: 'İade',
        Devir: 'Devir',
        DepoTransferi: 'Depo Transferi',
        KondisyonGuncelleme: 'Kondisyon Güncelleme',
        Kayip: 'Kayıp',
        Dusum: 'Düşüm',
        Kayit: 'Kayıt',
      };

      return (
        <Badge variant="outline" className={`text-xs ${colorMap[hareketTuru] || 'bg-gray-100 text-gray-800'}`}>
          {labelMap[hareketTuru] || hareketTuru}
        </Badge>
      );
    },
    size: 180,
    meta: {
      exportHeader: 'Hareket Türü',
      filterVariant: 'select',
    },
  },

  {
    accessorKey: 'kaynak',
    accessorFn: row => {
      const personelBilgileri = row.personelBilgileri;
      if (typeof personelBilgileri === 'string') {
        try {
          const parsed = JSON.parse(personelBilgileri);
          return parsed.kaynakPersonel?.ad || parsed.kaynakPersonel?.sicil || '';
        } catch {
          return '';
        }
      }

      return personelBilgileri?.kaynakPersonel?.ad || personelBilgileri?.kaynakPersonel?.sicil || '';
    },
    header: ({ column }) => <HeaderButton column={column} title="Kaynak Personel" />,
    cell: ({ row }) => {
      let kaynakPersonel = null;
      const personelBilgileri = row.original.personelBilgileri;

      if (typeof personelBilgileri === 'string') {
        try {
          const parsed = JSON.parse(personelBilgileri);
          kaynakPersonel = parsed.kaynakPersonel;
        } catch {
          // JSON parse hatası
        }
      } else {
        kaynakPersonel = personelBilgileri?.kaynakPersonel;
      }

      if (!kaynakPersonel) {
        return <div className="text-gray-500 text-sm">Depo</div>;
      }

      return <AvatarWithName name={kaynakPersonel?.ad} sicil={kaynakPersonel?.sicil} avatar={kaynakPersonel?.avatar} subText={kaynakPersonel?.sicil} />;
    },
    size: 180,
    meta: {
      exportHeader: 'Kaynak Personel',
      filterVariant: 'text',
    },
  },
  {
    accessorKey: 'hedef',
    accessorFn: row => {
      // JSON içindeki hedefPersonel bilgisine eriş
      const personelBilgileri = row.personelBilgileri;
      if (typeof personelBilgileri === 'string') {
        try {
          const parsed = JSON.parse(personelBilgileri);
          return parsed.hedefPersonel?.ad || parsed.hedefPersonel?.sicil || '';
        } catch {
          return '';
        }
      }
      return personelBilgileri?.hedefPersonel?.ad || personelBilgileri?.hedefPersonel?.sicil || '';
    },
    header: ({ column }) => <HeaderButton column={column} title="Hedef Personel" />,
    cell: ({ row }) => {
      let hedefPersonel = null;
      const personelBilgileri = row.original.personelBilgileri;

      if (typeof personelBilgileri === 'string') {
        try {
          const parsed = JSON.parse(personelBilgileri);
          hedefPersonel = parsed.hedefPersonel;
        } catch {
          // JSON parse hatası
        }
      } else {
        hedefPersonel = personelBilgileri?.hedefPersonel;
      }

      if (!hedefPersonel) {
        return <div className="text-gray-500 text-sm">-</div>;
      }

      return <AvatarWithName name={hedefPersonel?.ad} sicil={hedefPersonel?.sicil} avatar={hedefPersonel?.avatar} subText={hedefPersonel?.sicil} />;
    },
    size: 180,
    meta: {
      exportHeader: 'Hedef Personel',
      filterVariant: 'text',
    },
  },
  {
    accessorKey: 'konum',
    accessorFn: row => {
      // JSON içindeki konum bilgisine eriş
      const konumBilgileri = row.konumBilgileri;
      if (typeof konumBilgileri === 'string') {
        try {
          const parsed = JSON.parse(konumBilgileri);
          return parsed?.ad || '';
        } catch {
          return '';
        }
      }
      return konumBilgileri?.ad || '';
    },
    header: ({ column }) => <HeaderButton column={column} title="Konum" />,
    cell: ({ row }) => {
      let konum = null;
      const konumBilgileri = row.original.konumBilgileri;

      if (typeof konumBilgileri === 'string') {
        try {
          const parsed = JSON.parse(konumBilgileri);
          konum = parsed;
        } catch {
          // JSON parse hatası
        }
      } else {
        konum = konumBilgileri;
      }

      if (!konum) {
        return <div className="text-gray-500 text-sm">-</div>;
      }

      return (
        <div className="text-sm">
          <div className="font-medium">{konum.ad}</div>
          {konum.depo && <div className="text-xs text-gray-500">{konum.depo}</div>}
        </div>
      );
    },
    size: 150,
    meta: {
      exportHeader: 'Konum',
      filterVariant: 'text',
    },
  },
  {
    accessorKey: 'toplamMalzeme', // Veritabanında bu alan var
    header: ({ column }) => <HeaderButton column={column} title="Malzeme Sayısı" />,
    cell: ({ row }) => {
      const toplamMalzeme = row.getValue('toplamMalzeme') || 0;
      return (
        <div className="text-center">
          <Badge variant="secondary" className="text-xs font-mono">
            {toplamMalzeme}
          </Badge>
        </div>
      );
    },
    size: 120,
    enableSorting: true,
    meta: {
      exportHeader: 'Malzeme Sayısı',
      filterVariant: 'number',
    },
  },
];
