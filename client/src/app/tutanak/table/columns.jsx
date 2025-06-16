import { HeaderButton } from '@/components/table/HeaderButton';
import { Badge } from '@/components/ui/badge';
import { AvatarWithName } from '@/components/table/AvatarWithName';

export const Tutanak_Columns = () => [
 {
  accessorKey: 'tutanakId',
  header: ({ column }) => <HeaderButton column={column} title="Tutanak No" />,
  cell: ({ row }) => {
    const tutanakNo = row.original?.id;
    return (
      <div className="font-medium font-mono text-sm whitespace-normal break-all leading-tight max-w-[300px]">
        {tutanakNo || '-'}
      </div>
    );
  },
  enableHiding: false,
  size: 300,
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
        <Badge variant="outline" className={`text-xs bg-primary/10`}>
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
  //!KAYNAK
  // Kaynak Konum Column
  {
    accessorKey: 'kaynakKonum',
    accessorFn: row => {
      const konumBilgileri = row.konumBilgileri;

      // Konum bilgisi hiç yoksa
      if (!konumBilgileri) {
        return '';
      }

      // Tek konum durumu (kaynakKonum)
      if (konumBilgileri.kaynakKonum) {
        const konum = konumBilgileri.kaynakKonum;
        return konum.ad || '';
      }

      // Çoklu konum durumu (kaynakKonumlar object)
      if (konumBilgileri.kaynakKonumlar && typeof konumBilgileri.kaynakKonumlar === 'object') {
        const konumlar = Object.values(konumBilgileri.kaynakKonumlar);

        // Boş object
        if (konumlar.length === 0) {
          return '';
        }

        // Benzersiz konumları bul (aynı id'liler tek gösterilsin)
        const benzersizKonumlar = konumlar.filter((konum, index, self) => self.findIndex(k => k.id === konum.id) === index);

        // Tek benzersiz konum varsa, o konumun adını döndür
        if (benzersizKonumlar.length === 1) {
          return benzersizKonumlar[0].ad || '';
        }

        // Birden fazla benzersiz konum varsa, virgülle ayrılmış string döndür
        return benzersizKonumlar
          .map(konum => konum.ad)
          .filter(ad => ad) // Boş adları filtrele
          .join(', ');
      }

      // Hiçbir duruma uymuyorsa boş string döndür
      return '';
    },
    header: ({ column }) => <HeaderButton column={column} title="Kaynak Konum" />,
    cell: ({ row }) => {
      const konumBilgileri = row.original.konumBilgileri;

      // Konum bilgisi hiç yoksa
      if (!konumBilgileri) {
        return <div className="text-gray-500 text-sm">-</div>;
      }

      // Tek konum durumu (kaynakKonum)
      if (konumBilgileri.kaynakKonum) {
        const konum = konumBilgileri.kaynakKonum;
        return (
          <div className="text-sm">
            <div className="font-medium">{konum.ad}</div>
            {konum.depo && <div className="text-xs text-gray-500">{konum.depo}</div>}
          </div>
        );
      }

      // Çoklu konum durumu (kaynakKonumlar object)
      if (konumBilgileri.kaynakKonumlar && typeof konumBilgileri.kaynakKonumlar === 'object') {
        const konumlar = Object.values(konumBilgileri.kaynakKonumlar);

        // Boş object
        if (konumlar.length === 0) {
          return <div className="text-gray-500 text-sm">-</div>;
        }

        // Tek konum (object içinde tek entry)
        if (konumlar.length === 1) {
          const konum = konumlar[0];
          return (
            <div className="text-sm">
              <div className="font-medium">{konum.ad}</div>
              {konum.depo && <div className="text-xs text-gray-500">{konum.depo}</div>}
            </div>
          );
        }

        // Benzersiz konumları bul (aynı id'liler tek gösterilsin)
        const benzersizKonumlar = konumlar.filter((konum, index, self) => self.findIndex(k => k.id === konum.id) === index);

        // Tek benzersiz konum varsa
        if (benzersizKonumlar.length === 1) {
          const konum = benzersizKonumlar[0];
          return (
            <div className="text-sm">
              <div className="font-medium">{konum.ad}</div>
              {konum.depo && <div className="text-xs text-gray-500">{konum.depo}</div>}
            </div>
          );
        }

        // Birden fazla benzersiz konum - hepsini göster
        return (
          <div className="text-sm space-y-1">
            {benzersizKonumlar.map((konum, index) => (
              <div key={konum.id || index} className="border-l-2 border-primary/20 flex items-center gap-2 pl-2">
                <div className="font-medium text-xs">{konum.ad}</div>
                {konum.depo && <div className="text-xs text-gray-500">{konum.depo}</div>}
              </div>
            ))}
          </div>
        );
      }

      // Hiçbir duruma uymuyorsa
      return <div className="text-gray-500 text-sm">-</div>;
    },
    size: 150,
    meta: {
      exportHeader: 'Kaynak Konum',
      filterVariant: 'text',
    },
  },
  // Kaynak Personel Column
  {
    accessorKey: 'kaynakPersonel',
    accessorFn: row => {
      const personelBilgileri = row.personelBilgileri;

      // Personel bilgisi hiç yoksa
      if (!personelBilgileri) {
        return '';
      }

      let parsedPersonelBilgileri;

      // String ise parse et
      if (typeof personelBilgileri === 'string') {
        try {
          parsedPersonelBilgileri = JSON.parse(personelBilgileri);
        } catch {
          return '';
        }
      } else {
        parsedPersonelBilgileri = personelBilgileri;
      }

      // Tek personel durumu (kaynakPersonel)
      if (parsedPersonelBilgileri.kaynakPersonel) {
        const personel = parsedPersonelBilgileri.kaynakPersonel;
        return personel?.ad || personel?.sicil || '';
      }

      // Çoklu personel durumu (kaynakPersoneller object)
      if (parsedPersonelBilgileri.kaynakPersoneller && typeof parsedPersonelBilgileri.kaynakPersoneller === 'object') {
        const personeller = Object.values(parsedPersonelBilgileri.kaynakPersoneller);

        // Boş object
        if (personeller.length === 0) {
          return '';
        }

        // Benzersiz personelleri bul (aynı id'liler tek gösterilsin)
        const benzersizPersoneller = personeller.filter((personel, index, self) => self.findIndex(p => p.id === personel.id) === index);

        // Tek benzersiz personel varsa, o personelin ad veya sicil bilgisini döndür
        if (benzersizPersoneller.length === 1) {
          const personel = benzersizPersoneller[0];
          return personel?.ad || personel?.sicil || '';
        }

        // Birden fazla benzersiz personel varsa, ad veya sicil bilgilerini virgülle birleştir
        return benzersizPersoneller
          .map(personel => personel?.ad || personel?.sicil)
          .filter(bilgi => bilgi) // Boş değerleri filtrele
          .join(', ');
      }

      // Hiçbir duruma uymuyorsa boş string döndür
      return '';
    },
    header: ({ column }) => <HeaderButton column={column} title="Kaynak Personel" />,
    cell: ({ row }) => {
      const personelBilgileri = row.original.personelBilgileri;

      // Personel bilgisi hiç yoksa
      if (!personelBilgileri) {
        return <div className="text-gray-500 text-sm">-</div>;
      }

      let parsedPersonelBilgileri;

      // String ise parse et
      if (typeof personelBilgileri === 'string') {
        try {
          parsedPersonelBilgileri = JSON.parse(personelBilgileri);
        } catch {
          return <div className="text-gray-500 text-sm">-</div>;
        }
      } else {
        parsedPersonelBilgileri = personelBilgileri;
      }

      // Tek personel durumu (kaynakPersonel)
      if (parsedPersonelBilgileri.kaynakPersonel) {
        const personel = parsedPersonelBilgileri.kaynakPersonel;
        return <AvatarWithName user={personel} />;
      }

      // Çoklu personel durumu (kaynakPersoneller object)
      if (parsedPersonelBilgileri.kaynakPersoneller && typeof parsedPersonelBilgileri.kaynakPersoneller === 'object') {
        const personeller = Object.values(parsedPersonelBilgileri.kaynakPersoneller);

        // Boş object
        if (personeller.length === 0) {
          return <div className="text-gray-500 text-sm">-</div>;
        }

        // Tek personel (object içinde tek entry)
        if (personeller.length === 1) {
          const personel = personeller[0];
          return <AvatarWithName user={personel} />;
        }

        // Benzersiz personelleri bul (aynı id'liler tek gösterilsin)
        const benzersizPersoneller = personeller.filter((personel, index, self) => self.findIndex(p => p.id === personel.id) === index);

        // Tek benzersiz personel varsa
        if (benzersizPersoneller.length === 1) {
          const personel = benzersizPersoneller[0];
          return <AvatarWithName user={personel} />;
        }

        // Birden fazla benzersiz personel - hepsini göster
        return (
          <div className="space-y-2">
            {benzersizPersoneller.map((personel, index) => (
              <div key={personel.id || index} className="">
                <AvatarWithName user={personel} />
              </div>
            ))}
          </div>
        );
      }

      // Hiçbir duruma uymuyorsa
      return <div className="text-gray-500 text-sm">-</div>;
    },
    size: 180,
    meta: {
      exportHeader: 'Kaynak Personel',
      filterVariant: 'text',
    },
  },
  //!HEDEF
  // Hedef Konum Column
  {
    accessorKey: 'hedefKonum',
    accessorFn: row => {
      const konumBilgileri = row.konumBilgileri;

      // Konum bilgisi hiç yoksa
      if (!konumBilgileri) {
        return '';
      }

      // String ise parse et
      if (typeof konumBilgileri === 'string') {
        try {
          const parsed = JSON.parse(konumBilgileri);
          // Tek konum durumu
          if (parsed.hedefKonum) {
            return parsed.hedefKonum.ad || '';
          }
          // Çoklu konum durumu
          if (parsed.hedefKonumlar && typeof parsed.hedefKonumlar === 'object') {
            const konumlar = Object.values(parsed.hedefKonumlar);
            if (konumlar.length === 0) return '';

            const benzersizKonumlar = konumlar.filter((konum, index, self) => self.findIndex(k => k.id === konum.id) === index);

            if (benzersizKonumlar.length === 1) {
              return benzersizKonumlar[0].ad || '';
            }

            return benzersizKonumlar
              .map(konum => konum.ad)
              .filter(ad => ad)
              .join(', ');
          }
          return '';
        } catch {
          return '';
        }
      }

      // Object ise direkt işle
      // Tek konum durumu
      if (konumBilgileri.hedefKonum) {
        return konumBilgileri.hedefKonum.ad || '';
      }

      // Çoklu konum durumu
      if (konumBilgileri.hedefKonumlar && typeof konumBilgileri.hedefKonumlar === 'object') {
        const konumlar = Object.values(konumBilgileri.hedefKonumlar);
        if (konumlar.length === 0) return '';

        const benzersizKonumlar = konumlar.filter((konum, index, self) => self.findIndex(k => k.id === konum.id) === index);

        if (benzersizKonumlar.length === 1) {
          return benzersizKonumlar[0].ad || '';
        }

        return benzersizKonumlar
          .map(konum => konum.ad)
          .filter(ad => ad)
          .join(', ');
      }

      return '';
    },
    header: ({ column }) => <HeaderButton column={column} title="Hedef Konum" />,
    cell: ({ row }) => {
      const konumBilgileri = row.original.konumBilgileri;

      // Konum bilgisi hiç yoksa
      if (!konumBilgileri) {
        return <div className="text-gray-500 text-sm">-</div>;
      }

      // Tek konum durumu (hedefKonum)
      if (konumBilgileri.hedefKonum) {
        const konum = konumBilgileri.hedefKonum;
        return (
          <div className="text-sm">
            <div className="font-medium">{konum.ad}</div>
            {konum.depo && <div className="text-xs text-gray-500">{konum.depo}</div>}
          </div>
        );
      }

      // Çoklu konum durumu (hedefKonumlar object)
      if (konumBilgileri.hedefKonumlar && typeof konumBilgileri.hedefKonumlar === 'object') {
        const konumlar = Object.values(konumBilgileri.hedefKonumlar);

        // Boş object
        if (konumlar.length === 0) {
          return <div className="text-gray-500 text-sm">-</div>;
        }

        // Tek konum (object içinde tek entry)
        if (konumlar.length === 1) {
          const konum = konumlar[0];
          return (
            <div className="text-sm">
              <div className="font-medium">{konum.ad}</div>
              {konum.depo && <div className="text-xs text-gray-500">{konum.depo}</div>}
            </div>
          );
        }

        // Benzersiz konumları bul
        const benzersizKonumlar = konumlar.filter((konum, index, self) => self.findIndex(k => k.id === konum.id) === index);

        // Tek benzersiz konum varsa
        if (benzersizKonumlar.length === 1) {
          const konum = benzersizKonumlar[0];
          return (
            <div className="text-sm">
              <div className="font-medium">{konum.ad}</div>
              {konum.depo && <div className="text-xs text-gray-500">{konum.depo}</div>}
            </div>
          );
        }

        // Birden fazla benzersiz konum - hepsini göster
        return (
          <div className="text-sm space-y-1">
            {benzersizKonumlar.map((konum, index) => (
              <div key={konum.id || index} className="border-l-2 border-primary/20 flex items-center gap-2 pl-2">
                <div className="font-medium text-xs">{konum.ad}</div>
                {konum.depo && <div className="text-xs text-gray-500">{konum.depo}</div>}
              </div>
            ))}
          </div>
        );
      }

      // Hiçbir duruma uymuyorsa
      return <div className="text-gray-500 text-sm">-</div>;
    },
    size: 150,
    meta: {
      exportHeader: 'Hedef Konum',
      filterVariant: 'text',
    },
  },
  // Hedef Personel Column
  {
    accessorKey: 'hedefPersonel',
    accessorFn: row => {
      const personelBilgileri = row.personelBilgileri;

      // Personel bilgisi hiç yoksa
      if (!personelBilgileri) {
        return '';
      }

      let parsedPersonelBilgileri;

      // String ise parse et
      if (typeof personelBilgileri === 'string') {
        try {
          parsedPersonelBilgileri = JSON.parse(personelBilgileri);
        } catch {
          return '';
        }
      } else {
        parsedPersonelBilgileri = personelBilgileri;
      }

      // Tek personel durumu (hedefPersonel)
      if (parsedPersonelBilgileri.hedefPersonel) {
        const personel = parsedPersonelBilgileri.hedefPersonel;
        return personel?.ad || personel?.sicil || '';
      }

      // Çoklu personel durumu (hedefPersoneller object)
      if (parsedPersonelBilgileri.hedefPersoneller && typeof parsedPersonelBilgileri.hedefPersoneller === 'object') {
        const personeller = Object.values(parsedPersonelBilgileri.hedefPersoneller);

        // Boş object
        if (personeller.length === 0) {
          return '';
        }

        // Benzersiz personelleri bul
        const benzersizPersoneller = personeller.filter((personel, index, self) => self.findIndex(p => p.id === personel.id) === index);

        // Tek benzersiz personel varsa
        if (benzersizPersoneller.length === 1) {
          const personel = benzersizPersoneller[0];
          return personel?.ad || personel?.sicil || '';
        }

        // Birden fazla benzersiz personel varsa, ad veya sicil bilgilerini virgülle birleştir
        return benzersizPersoneller
          .map(personel => personel?.ad || personel?.sicil)
          .filter(bilgi => bilgi)
          .join(', ');
      }

      // Hiçbir duruma uymuyorsa boş string döndür
      return '';
    },
    header: ({ column }) => <HeaderButton column={column} title="Hedef Personel" />,
    cell: ({ row }) => {
      const personelBilgileri = row.original.personelBilgileri;

      // Personel bilgisi hiç yoksa
      if (!personelBilgileri) {
        return <div className="text-gray-500 text-sm">-</div>;
      }

      let parsedPersonelBilgileri;

      // String ise parse et
      if (typeof personelBilgileri === 'string') {
        try {
          parsedPersonelBilgileri = JSON.parse(personelBilgileri);
        } catch {
          return <div className="text-gray-500 text-sm">-</div>;
        }
      } else {
        parsedPersonelBilgileri = personelBilgileri;
      }

      // Tek personel durumu (hedefPersonel)
      if (parsedPersonelBilgileri.hedefPersonel) {
        const personel = parsedPersonelBilgileri.hedefPersonel;
        return <AvatarWithName user={personel} />;
      }

      // Çoklu personel durumu (hedefPersoneller object)
      if (parsedPersonelBilgileri.hedefPersoneller && typeof parsedPersonelBilgileri.hedefPersoneller === 'object') {
        const personeller = Object.values(parsedPersonelBilgileri.hedefPersoneller);

        // Boş object
        if (personeller.length === 0) {
          return <div className="text-gray-500 text-sm">-</div>;
        }

        // Tek personel (object içinde tek entry)
        if (personeller.length === 1) {
          const personel = personeller[0];
          return <AvatarWithName user={personel} />;
        }

        // Benzersiz personelleri bul
        const benzersizPersoneller = personeller.filter((personel, index, self) => self.findIndex(p => p.id === personel.id) === index);

        // Tek benzersiz personel varsa
        if (benzersizPersoneller.length === 1) {
          const personel = benzersizPersoneller[0];
          return <AvatarWithName user={personel} />;
        }

        // Birden fazla benzersiz personel - hepsini göster
        return (
          <div className="space-y-2">
            {benzersizPersoneller.map((personel, index) => (
              <div key={personel.id || index} className="">
                <AvatarWithName user={personel} />
              </div>
            ))}
          </div>
        );
      }

      // Hiçbir duruma uymuyorsa
      return <div className="text-gray-500 text-sm">-</div>;
    },
    size: 180,
    meta: {
      exportHeader: 'Hedef Personel',
      filterVariant: 'text',
    },
  },
  //! ==
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
