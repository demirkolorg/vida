import React, { useState, useEffect, useRef } from 'react';

// İkonlar
import { FileText, Eye, Save, Printer, PlusCircle, X } from 'lucide-react';

// Shadcn/UI Bileşenleri (Projenize eklenmiş olmalı)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// --- MOCK VERİLER (Seri No alanı eklendi) ---
const mockMalzemeler = [
  { id: 'mal1', vidaNo: 'V001', sabitKodu: 'DELL-LT-01', marka: 'Dell', model: 'Latitude 5520', malzemeTipi: 'Demirbas', kondisyon: 'Saglam', birim: 'Adet', sube: 'Bilgi Teknolojileri', seriNo: 'BDEM2024001' },
  { id: 'mal2', vidaNo: 'V002', sabitKodu: 'HP-PRN-05', marka: 'HP', model: 'LaserJet Pro M404dn', malzemeTipi: 'Demirbas', kondisyon: 'Saglam', birim: 'Adet', sube: 'İnsan Kaynakları', seriNo: 'BDEM2024002' },
  { id: 'mal3', vidaNo: 'V003', sabitKodu: 'LOGI-MSE-12', marka: 'Logitech', model: 'MX Master 3', malzemeTipi: 'Sarf', kondisyon: 'Saglam', birim: 'Adet', sube: 'Tüm Şubeler', seriNo: 'N/A' },
  { id: 'mal4', vidaNo: 'V004', sabitKodu: 'SAMS-MON-08', marka: 'Samsung', model: 'Odyssey G7', malzemeTipi: 'Demirbas', kondisyon: 'Arizali', birim: 'Adet', sube: 'Grafik Tasarım', seriNo: 'BDEM2024004' },
  { id: 'mal5', vidaNo: 'V005', sabitKodu: 'A4-KAĞIT', marka: 'Copier Bond', model: 'A4 80gr', malzemeTipi: 'Sarf', kondisyon: 'Saglam', birim: 'Paket', sube: 'Genel', seriNo: 'N/A' },
];

const mockPersoneller = [
  { id: 'per1', ad: 'Asya Hilal', soyad: 'DEMİRKOL', sicil: '100008', avatar: 'https://i.pravatar.cc/150?u=asya', buro: 'A Blok - 101', sube: 'Bilgi Teknolojileri', birim: 'Yazılım Geliştirme' },
  { id: 'per2', ad: 'Ayşenur', soyad: 'DEMİRKOL', sicil: '100009', avatar: 'https://i.pravatar.cc/150?u=aysenur', buro: 'B Blok - 205', sube: 'İnsan Kaynakları', birim: 'İşe Alım' },
  { id: 'per3', ad: 'Fatma', soyad: 'Kaya', sicil: '54321', avatar: 'https://i.pravatar.cc/150?u=fatma', buro: 'C Blok - 302', sube: 'Finans', birim: 'Muhasebe' },
];

const mockKonumlar = [
  { id: 'kon1', ad: 'Ana Depo', depo: 'Merkez Kampüs', aciklama: 'Tüm demirbaşların tutulduğu ana depo' },
  { id: 'kon2', ad: 'BT Deposu', depo: 'A Blok', aciklama: 'Sadece IT ekipmanları için' },
  { id: 'kon3', ad: 'Arşiv Odası', depo: 'Zemin Kat', aciklama: 'Eski ve hurda malzemeler' },
];

// --- HAREKET TÜRÜ TANIMLARI ---
// (Bu kısım önceki kodla aynı, değiştirilmedi)
const HAREKET_TURU_OPTIONS = [
    { value: 'Zimmet', label: 'Zimmet', description: 'Malzemelerin personele verilmesi' },
    { value: 'Iade', label: 'İade', description: 'Malzemelerin depoya iade edilmesi' },
    { value: 'Devir', label: 'Devir', description: 'Malzemelerin personel arası transferi' },
    { value: 'DepoTransferi', label: 'Depo Transferi', description: 'Malzemelerin depo arası transferi' },
    { value: 'KondisyonGuncelleme', label: 'Kondisyon Güncelleme', description: 'Malzeme durumu güncelleme' },
    { value: 'Kayip', label: 'Kayıp', description: 'Kayıp malzeme bildirimi' },
    { value: 'Dusum', label: 'Düşüm', description: 'Malzeme düşüm işlemi' },
    { value: 'Kayit', label: 'Yeni Kayıt', description: 'Yeni malzeme kaydı' },
];

const fieldRequirements = {
  Zimmet: { malzemeler: { r: true, l: 'Malzemeler' }, hedefPersonel: { r: true, l: 'Zimmet Alacak Personel' }, kaynakKonum: { r: true, l: 'Kaynak Konum' }, aciklama: { r: false, l: 'Açıklama' } },
  Iade: { malzemeler: { r: true, l: 'Malzemeler' }, kaynakPersonel: { r: true, l: 'İade Eden Personel' }, hedefKonum: { r: true, l: 'İade Edilecek Konum' }, aciklama: { r: false, l: 'Açıklama' } },
  Devir: { malzemeler: { r: true, l: 'Malzemeler' }, kaynakPersonel: { r: true, l: 'Devreden Personel' }, hedefPersonel: { r: true, l: 'Devralan Personel' }, aciklama: { r: false, l: 'Açıklama' } },
  DepoTransferi: { malzemeler: { r: true, l: 'Malzemeler' }, kaynakKonum: { r: true, l: 'Kaynak Konum' }, hedefKonum: { r: true, l: 'Hedef Konum' }, aciklama: { r: false, l: 'Açıklama' } },
  KondisyonGuncelleme: { malzemeler: { r: true, l: 'Malzemeler' }, yeniKondisyon: { r: true, l: 'Yeni Kondisyon' }, aciklama: { r: true, l: 'Gerekçe' } },
  Kayip: { malzemeler: { r: true, l: 'Malzemeler' }, kaynakPersonel: { r: true, l: 'Sorumlu Personel' }, aciklama: { r: true, l: 'Kayıp Tutanağı Açıklaması' } },
  Dusum: { malzemeler: { r: true, l: 'Malzemeler' }, hedefKonum: { r: true, l: 'Hurda Deposu' }, aciklama: { r: true, l: 'Düşüm Gerekçesi' } },
  Kayit: { malzemeler: { r: true, l: 'Yeni Kaydedilecek Malzemeler' }, hedefKonum: { r: true, l: 'Kaydın Yapılacağı Konum' }, aciklama: { r: false, l: 'Açıklama' } }
};

const KONDISYON_OPTIONS = ['Saglam', 'Arizali', 'Hurda', 'Kayip'];

// --- YARDIMCI FONKSİYONLAR ---
const formatDateForTutanak = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
};

const generateTutanakId = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(100000 + Math.random() * 900000);
  return `TTN${yyyy}${mm}${dd}${random}`;
};

// --- ANA BİLEŞEN ---
export default function TutanakBuilder() {
    // STATE YÖNETİMİ VE FONKSİYONLAR ÖNCEKİ KODLA AYNI, DEĞİŞTİRİLMEDİ
    const initialTutanakState = {
        hareketTuru: '', malzemeler: [], kaynakPersonel: null, hedefPersonel: null,
        kaynakKonum: null, hedefKonum: null, yeniKondisyon: '', aciklama: '', islemTarihi: new Date(),
    };
    const [selectedHareketTuru, setSelectedHareketTuru] = useState('');
    const [tutanakData, setTutanakData] = useState(initialTutanakState);
    const [formErrors, setFormErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [tutanakId, setTutanakId] = useState('');
    const previewRef = useRef(null);

    useEffect(() => {
        if (!selectedHareketTuru) { setIsFormValid(false); return; }
        const requirements = fieldRequirements[selectedHareketTuru];
        const errors = {};
        if (requirements.malzemeler?.r && tutanakData.malzemeler.length === 0) errors.malzemeler = true;
        if (requirements.kaynakPersonel?.r && !tutanakData.kaynakPersonel) errors.kaynakPersonel = true;
        if (requirements.hedefPersonel?.r && !tutanakData.hedefPersonel) errors.hedefPersonel = true;
        if (requirements.kaynakKonum?.r && !tutanakData.kaynakKonum) errors.kaynakKonum = true;
        if (requirements.hedefKonum?.r && !tutanakData.hedefKonum) errors.hedefKonum = true;
        if (requirements.yeniKondisyon?.r && !tutanakData.yeniKondisyon) errors.yeniKondisyon = true;
        if (requirements.aciklama?.r && !tutanakData.aciklama.trim()) errors.aciklama = true;
        setFormErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    }, [tutanakData, selectedHareketTuru]);

    const handleHareketTuruChange = (value) => {
        setSelectedHareketTuru(value);
        setTutanakData({ ...initialTutanakState, hareketTuru: value, islemTarihi: new Date() });
        setTutanakId(generateTutanakId());
    };
    const updateTutanakData = (field, value) => { setTutanakData(prev => ({ ...prev, [field]: value })); };
    const addMalzeme = (malzemeId) => {
        if (tutanakData.malzemeler.some(m => m.id === malzemeId)) return;
        const malzeme = mockMalzemeler.find(m => m.id === malzemeId);
        if (malzeme) { updateTutanakData('malzemeler', [...tutanakData.malzemeler, malzeme]); }
    };
    const removeMalzeme = (malzemeId) => { updateTutanakData('malzemeler', tutanakData.malzemeler.filter(m => m.id !== malzemeId)); };
    const handleSelectChange = (field, id, source) => {
        const selectedItem = source.find(item => item.id === id);
        updateTutanakData(field, selectedItem);
    };
    const handlePrint = () => {
        const printContents = previewRef.current.innerHTML;
        const printWindow = window.open('', '', 'height=1123,width=794'); // A4 boyutuna yakın
        printWindow.document.write('<html><head><title>Tutanak Yazdır</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>'); // Tailwind CDN'i
        printWindow.document.write('<style> body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } </style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    };
    
    // --- YENİ YARDIMCI FONKSİYONLAR ---
    const getTutanakTitle = () => {
        if(!selectedHareketTuru) return "MALZEME HAREKET TUTANAĞI";
        const tur = HAREKET_TURU_OPTIONS.find(o => o.value === selectedHareketTuru)?.label || '';
        return `MALZEME ${tur.toUpperCase()} TUTANAĞI`;
    }

    const generateAciklamaText = () => {
        if (tutanakData.malzemeler.length === 0) return "";
        let text = `Yukarıdaki tabloda stok kodu, marka, model ve seri numaraları belirtilen iki (${tutanakData.malzemeler.length}) adet malzeme`;
        
        switch (selectedHareketTuru) {
            case 'Devir':
                const devreden = tutanakData.kaynakPersonel ? `${tutanakData.kaynakPersonel.ad} ${tutanakData.kaynakPersonel.soyad}` : 'bir personelden';
                const devralan = tutanakData.hedefPersonel ? `${tutanakData.hedefPersonel.ad} ${tutanakData.hedefPersonel.soyad}` : 'diğerine';
                text += ` ${devreden} isimli personelden ${devralan} isimli personele devredilmiştir. Devir işlemi tamamlanmış olup, malzeme sorumluluğu yeni personele geçmiştir.`;
                break;
            case 'Zimmet':
                 const zimmetAlan = tutanakData.hedefPersonel ? `${tutanakData.hedefPersonel.ad} ${tutanakData.hedefPersonel.soyad}` : 'personele';
                 text += `, ${zimmetAlan} isimli personele zimmetlenmiştir. Zimmet işlemi tamamlanmış olup, malzeme sorumluluğu personele geçmiştir.`;
                 break;
            case 'Iade':
                 const iadeEden = tutanakData.kaynakPersonel ? `${tutanakData.kaynakPersonel.ad} ${tutanakData.kaynakPersonel.soyad}` : 'personel tarafından';
                 const iadeKonum = tutanakData.hedefKonum ? tutanakData.hedefKonum.ad : 'depoya';
                 text += `, ${iadeEden} isimli personel tarafından ${iadeKonum} konumuna iade edilmiştir.`;
                 break;
            default:
                text = tutanakData.aciklama || "İşlem başarıyla gerçekleştirilmiştir.";
                break;
        }
        return text;
    };
    
    const getImzaAlanlari = () => {
        const { kaynakPersonel, hedefPersonel } = tutanakData;
        let alanlar = [
            { rol: "TESLİM EDEN", kisi: { ad: "....................", sicil: ".........." } },
            { rol: "TESLİM ALAN", kisi: { ad: "....................", sicil: ".........." } },
            { rol: "ONAYLAYAN", kisi: { ad: "Süper ADMIN", sicil: "999999" } }
        ];

        switch(selectedHareketTuru) {
            case 'Devir':
            case 'Kayip':
                if (kaynakPersonel) alanlar[0].kisi = { ad: `${kaynakPersonel.ad} ${kaynakPersonel.soyad}`, sicil: kaynakPersonel.sicil };
                if (hedefPersonel) alanlar[1].kisi = { ad: `${hedefPersonel.ad} ${hedefPersonel.soyad}`, sicil: hedefPersonel.sicil };
                break;
            case 'Zimmet':
                alanlar[0].rol = "TESLİM EDEN (DEPO)";
                alanlar[0].kisi = { ad: "Depo Sorumlusu", sicil: "000001" };
                alanlar[1].rol = "TESLİM ALAN (ZİMMETLİ)";
                if (hedefPersonel) alanlar[1].kisi = { ad: `${hedefPersonel.ad} ${hedefPersonel.soyad}`, sicil: hedefPersonel.sicil };
                break;
            case 'Iade':
                alanlar[0].rol = "İADE EDEN";
                if (kaynakPersonel) alanlar[0].kisi = { ad: `${kaynakPersonel.ad} ${kaynakPersonel.soyad}`, sicil: kaynakPersonel.sicil };
                alanlar[1].rol = "TESLİM ALAN (DEPO)";
                alanlar[1].kisi = { ad: "Depo Sorumlusu", sicil: "000001" };
                break;
            default:
                 if (kaynakPersonel) alanlar[0].kisi = { ad: `${kaynakPersonel.ad} ${kaynakPersonel.soyad}`, sicil: kaynakPersonel.sicil };
                 if (hedefPersonel) alanlar[1].kisi = { ad: `${hedefPersonel.ad} ${hedefPersonel.soyad}`, sicil: hedefPersonel.sicil };
                break;
        }
        return alanlar;
    }
    
  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900 font-sans">
      {/* Sol Panel: Form Builder (DEĞİŞİKLİK YOK) */}
      <div className="w-1/2 flex flex-col p-4">
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <CardTitle className="text-2xl">Tutanak Builder</CardTitle>
                <CardDescription>Yeni bir malzeme hareket tutanağı oluşturun.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <ScrollArea className="flex-grow p-6">
            <div className="space-y-6">
              {/* Hareket Türü Seçimi */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Hareket Türü</CardTitle>
                  <CardDescription>Lütfen yapılacak işlem türünü seçiniz.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={handleHareketTuruChange} value={selectedHareketTuru}>
                    <SelectTrigger>
                      <SelectValue placeholder="Hareket türü seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {HAREKET_TURU_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex flex-col">
                            <span className="font-semibold">{opt.label}</span>
                            <span className="text-xs text-gray-500">{opt.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {selectedHareketTuru && fieldRequirements[selectedHareketTuru] && (
                <div className="space-y-6">
                  {/* Dinamik Alanlar Kodları (DEĞİŞİKLİK YOK) */}
                  {Object.entries(fieldRequirements[selectedHareketTuru]).map(([key, config]) => {
                    const hasError = formErrors[key];
                    if (key === 'malzemeler') return (
                      <Card key={key} className={hasError ? 'border-red-500' : ''}>
                        <CardHeader>
                           <div className="flex justify-between items-center">
                            <CardTitle className="text-lg flex items-center gap-2">{config.l} {config.r && <Badge variant="destructive">Zorunlu</Badge>}</CardTitle>
                             <Badge variant="secondary">{tutanakData.malzemeler.length} adet seçili</Badge>
                           </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {tutanakData.malzemeler.map(m => (
                              <div key={m.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                                <div><p className="font-semibold">{m.marka} {m.model}</p><p className="text-sm text-gray-500">{m.vidaNo}</p></div>
                                <Button variant="ghost" size="icon" onClick={() => removeMalzeme(m.id)}><X className="h-4 w-4" /></Button>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-4" />
                          <Select onValueChange={addMalzeme}>
                            <SelectTrigger><SelectValue placeholder="Malzeme ekle..." /></SelectTrigger>
                            <SelectContent>
                              {mockMalzemeler.map(m => (
                                <SelectItem key={m.id} value={m.id} disabled={tutanakData.malzemeler.some(sm => sm.id === m.id)}>{m.marka} {m.model} ({m.vidaNo})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>
                    );
                     if (key.includes('Personel')) return (
                      <Card key={key} className={hasError ? 'border-red-500' : ''}>
                        <CardHeader><CardTitle className="text-lg flex items-center gap-2">{config.l} {config.r && <Badge variant="destructive">Zorunlu</Badge>}</CardTitle></CardHeader>
                        <CardContent>
                          <Select onValueChange={(id) => handleSelectChange(key, id, mockPersoneller)}>
                            <SelectTrigger><SelectValue placeholder="Personel seçin..." /></SelectTrigger>
                            <SelectContent>
                              {mockPersoneller.map(p => (
                                <SelectItem key={p.id} value={p.id}>
                                  <div className="flex items-center gap-2">
                                    <img src={p.avatar} alt={p.ad} className="h-6 w-6 rounded-full" />
                                    <span>{p.ad} {p.soyad} ({p.sicil})</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>
                    );
                    if (key.includes('Konum')) return ( /* ... kod değişmedi ... */  <Card key={key} className={hasError ? 'border-red-500' : ''}> <CardHeader> <CardTitle className="text-lg flex items-center gap-2">{config.l} {config.r && <Badge variant="destructive">Zorunlu</Badge>}</CardTitle> </CardHeader> <CardContent> <Select onValueChange={(id) => handleSelectChange(key, id, mockKonumlar)}> <SelectTrigger> <SelectValue placeholder="Konum seçin..." /> </SelectTrigger> <SelectContent> {mockKonumlar.map(k => ( <SelectItem key={k.id} value={k.id}> {k.ad} ({k.depo}) </SelectItem> ))} </SelectContent> </Select> </CardContent> </Card> );
                    if (key === 'yeniKondisyon') return ( /* ... kod değişmedi ... */ <Card key={key} className={hasError ? 'border-red-500' : ''}> <CardHeader><CardTitle className="text-lg flex items-center gap-2">{config.l} {config.r && <Badge variant="destructive">Zorunlu</Badge>}</CardTitle></CardHeader> <CardContent> <Select onValueChange={(val) => updateTutanakData('yeniKondisyon', val)}> <SelectTrigger><SelectValue placeholder="Kondisyon seçin..." /></SelectTrigger> <SelectContent> {KONDISYON_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)} </SelectContent> </Select> </CardContent> </Card> );
                    if (key === 'aciklama') return ( /* ... kod değişmedi ... */ <Card key={key} className={hasError ? 'border-red-500' : ''}> <CardHeader><CardTitle className="text-lg flex items-center gap-2">{config.l} {config.r && <Badge variant="destructive">Zorunlu</Badge>}</CardTitle></CardHeader> <CardContent> <Textarea placeholder="Açıklama giriniz..." value={tutanakData.aciklama} onChange={(e) => updateTutanakData('aciklama', e.target.value)} /> </CardContent> </Card> );
                    return null;
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-6 flex justify-end space-x-4">
            <Button variant="outline" disabled={!isFormValid}><Save className="mr-2 h-4 w-4" /> Tutanak Kaydet</Button>
            <Button onClick={handlePrint} disabled={!isFormValid}><Printer className="mr-2 h-4 w-4" /> Yazdır</Button>
          </div>
        </Card>
      </div>

      {/* Sağ Panel: Önizleme */}
      <div className="w-1/2 flex flex-col p-4">
        <Card className="flex-grow flex flex-col">
          <CardHeader>
             <div className="flex items-center space-x-3">
              <Eye className="h-8 w-8 text-green-500" />
              <div><CardTitle className="text-2xl">Tutanak Önizleme</CardTitle><CardDescription>Değişiklikleri burada anlık olarak görün.</CardDescription></div>
            </div>
          </CardHeader>
          <Separator />
          <ScrollArea className="flex-grow bg-gray-300 dark:bg-gray-700 p-4">
            {/* <!-- DEĞİŞİKLİK BAŞLANGICI --> */}
            <div ref={previewRef} className="p-6 bg-white shadow-lg mx-auto max-w-4xl border-2 border-green-700 font-serif text-black">
              {!selectedHareketTuru ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                  <FileText className="h-24 w-24 mb-4" />
                  <h3 className="text-2xl font-semibold">Tutanak Önizlemesi</h3>
                  <p>Başlamak için sol panelden bir hareket türü seçin.</p>
                </div>
              ) : (
                <div className="space-y-6">
                    {/* Tutanak Başlığı ve Logolar */}
                    <header className="flex justify-between items-start mb-6">
                        {/* Sol Logo Placeholder */}
                        <div className="w-24 h-24 flex items-center justify-center border-2 border-dashed">LOGO 1</div>
                        <div className="text-center">
                            <h1 className="text-xl font-bold">İÇİŞLERİ BAKANLIĞI</h1>
                            <h2 className="text-lg font-bold">VAN HAVALİMANI ŞUBE MÜDÜRLÜĞÜ</h2>
                            <h3 className="text-lg font-bold mt-4">{getTutanakTitle()}</h3>
                        </div>
                        {/* Sağ Logo Placeholder */}
                        <div className="w-24 h-24 flex items-center justify-center border-2 border-dashed">LOGO 2</div>
                    </header>

                    {/* Tutanak No ve Tarih */}
                    <div className="flex justify-between items-center text-sm font-semibold">
                        <span>Tutanak No: {tutanakId}</span>
                        <span>Tarih: {formatDateForTutanak(tutanakData.islemTarihi)}</span>
                    </div>

                    {/* Malzeme Listesi */}
                    <div className="mt-4">
                        <h4 className="text-center font-bold text-md mb-2">DEMİRBAŞ MALZEME LİSTESİ</h4>
                        <table className="w-full border-collapse border border-gray-400 text-sm">
                            <thead>
                                <tr className="bg-[#e2efda]">
                                    <th className="border border-gray-400 p-2 font-bold">S.N.</th>
                                    <th className="border border-gray-400 p-2 font-bold">Vida No</th>
                                    <th className="border border-gray-400 p-2 font-bold">Sabit Kodu</th>
                                    <th className="border border-gray-400 p-2 font-bold">Marka</th>
                                    <th className="border border-gray-400 p-2 font-bold">Model</th>
                                    <th className="border border-gray-400 p-2 font-bold">Seri No</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tutanakData.malzemeler.map((m, index) => (
                                <tr key={m.id}>
                                    <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-400 p-2">{m.vidaNo}</td>
                                    <td className="border border-gray-400 p-2">{m.sabitKodu}</td>
                                    <td className="border border-gray-400 p-2">{m.marka}</td>
                                    <td className="border border-gray-400 p-2">{m.model}</td>
                                    <td className="border border-gray-400 p-2">{m.seriNo || 'N/A'}</td>
                                </tr>
                                ))}
                                {tutanakData.malzemeler.length === 0 && (
                                  <tr><td colSpan="6" className="text-center p-4">Listeye malzeme eklenmedi.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Açıklama Metni */}
                    <div className="text-sm mt-4">
                        <p className="text-center mb-4">Toplam {tutanakData.malzemeler.length} kalem demirbaş malzemedir.</p>
                        <p>{generateAciklamaText()}</p>
                    </div>

                    {/* İmza Alanları */}
                    <div className="pt-16">
                        <div className="grid grid-cols-3 gap-8 text-center text-sm">
                            {getImzaAlanlari().map((imza, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <p className="font-bold">{imza.rol}</p>
                                    <p className="text-gray-400 my-2">İmza</p>
                                    <div className="w-full border-b border-black mt-12 mb-2"></div>
                                    <p className="font-semibold">{imza.kisi.ad.toUpperCase()}</p>
                                    <p>{imza.kisi.sicil}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              )}
            </div>
            {/* <!-- DEĞİŞİKLİK SONU --> */}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}