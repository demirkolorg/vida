// client/src/pages/RehberPage.jsx

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpen, Search, Settings, Users, Package, Database, Shield, AlertTriangle, CheckCircle, Info, Lightbulb, Code, Key, Layers, ChevronRight, ExternalLink } from 'lucide-react';

// Rehber dosyalarını import et
import { MarkaRehber } from '@/app/marka/constants/rehber';
import { ModelRehber } from '@/app/model/constants/rehber';
import { MalzemeRehber } from '@/app/malzeme/constants/rehber';
import { BirimRehber } from '@/app/birim/constants/rehber';
import { SubeRehber } from '@/app/sube/constants/rehber';
import { BuroRehber } from '@/app/buro/constants/rehber';
import { PersonelRehber } from '@/app/personel/constants/rehber';
import { DepoRehber } from '@/app/depo/constants/rehber';
import { KonumRehber } from '@/app/konum/constants/rehber';
import { SabitKoduRehber } from '@/app/sabitKodu/constants/rehber';
import { MalzemeHareketRehber } from '@/app/malzemeHareket/constants/rehber';
import { TutanakRehber } from '@/app/tutanak/constants/rehber';
import { AuditRehber } from '@/app/audit/constants/rehber';
import { GlobalSearchRehber } from '@/app/globalSearch/constants/rehber';

// Tüm modül rehberlerini topla
const MODUL_REHBERLERI = {
  personel: PersonelRehber,
  malzeme: MalzemeRehber,
  malzemeHareket: MalzemeHareketRehber,
  tutanak: TutanakRehber,
  globalSearch: GlobalSearchRehber,
  marka: MarkaRehber,
  model: ModelRehber,
  birim: BirimRehber,
  sube: SubeRehber,
  buro: BuroRehber,
  depo: DepoRehber,
  konum: KonumRehber,
  sabitKodu: SabitKoduRehber,
  audit: AuditRehber,
};

const RehberPage = () => {
  const [secilenModul, setSecilenModul] = useState('personel');
  const [aramaMetni, setAramaMetni] = useState('');
  const [aktifTab, setAktifTab] = useState('genel');

  const rehber = MODUL_REHBERLERI[secilenModul];

  // Modül kartı component'i
  const ModulCard = ({ modulKey, modulData, isSelected, onClick }) => {
    const IconComponent = modulData.modul.icon;

    return (
      <Card className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'bg-primary/10 border-primary border-2' : ''}`} onClick={() => onClick(modulKey)}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">{modulData.modul.ad}</CardTitle>
              <CardDescription className="text-sm">{modulData.modul.kategori}</CardDescription>
            </div>
            <Badge variant={modulData.modul.oncelik === 'Yüksek' ? 'destructive' : 'secondary'}>{modulData.modul.oncelik}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{modulData.modul.aciklama}</p>
          {modulData.modul.bagimlilık && modulData.modul.bagimlilık.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {modulData.modul.bagimlilık.map(dep => (
                <Badge key={dep} variant="outline" className="text-xs">
                  {dep}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Özellik kartı component'i
  const OzellikCard = ({ ozellik }) => {
    const IconComponent = ozellik.icon;

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{ozellik.baslik}</CardTitle>
              <CardDescription>{ozellik.aciklama}</CardDescription>
            </div>
            <div className="flex gap-1">
              {ozellik.yetki.map(role => (
                <Badge key={role} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {ozellik.adimlar && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Adımlar
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
                {ozellik.adimlar.map((adim, index) => (
                  <li key={index}>{adim}</li>
                ))}
              </ol>
            </div>
          )}

          {ozellik.notlar && ozellik.notlar.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                Notlar
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                {ozellik.notlar.map((not, index) => (
                  <li key={index}>{not}</li>
                ))}
              </ul>
            </div>
          )}

          {ozellik.uyarilar && ozellik.uyarilar.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Dikkat!</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {ozellik.uyarilar.map((uyari, index) => (
                    <li key={index}>{uyari}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {ozellik.gosterilen_bilgiler && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Database className="h-4 w-4 text-purple-600" />
                Gösterilen Bilgiler
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                {ozellik.gosterilen_bilgiler.map((bilgi, index) => (
                  <li key={index}>{bilgi}</li>
                ))}
              </ul>
            </div>
          )}

          {ozellik.ozellikler && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Settings className="h-4 w-4 text-orange-600" />
                Özellikler
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                {ozellik.ozellikler.map((oz, index) => (
                  <li key={index}>{oz}</li>
                ))}
              </ul>
            </div>
          )}

          {ozellik.ipuclari && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                İpuçları
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                {ozellik.ipuclari.map((ipucu, index) => (
                  <li key={index}>{ipucu}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Filtrelenmiş modüller
  const filtrelenmisModuller = Object.entries(MODUL_REHBERLERI).filter(([key, modul]) => modul.modul.ad.toLowerCase().includes(aramaMetni.toLowerCase()) || modul.modul.aciklama.toLowerCase().includes(aramaMetni.toLowerCase()));

  if (!rehber) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Modül Bulunamadı</AlertTitle>
          <AlertDescription>Seçilen modül için rehber bilgisi bulunmuyor.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-6 space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Sistem Rehberi
          </h1>
          <p className="text-muted-foreground mt-1">Sistem modülleri ve işlemler hakkında kapsamlı bilgiler</p>
        </div>
        <Badge variant="outline" className="text-sm">
          v{rehber.versiyon}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sol Panel - Modül Listesi */}
        <div className="lg:col-span-1 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Modül Ara</label>
            <Input placeholder="Modül adı veya açıklama..." value={aramaMetni} onChange={e => setAramaMetni(e.target.value)} className="w-full" />
          </div>

          <ScrollArea className="h-[800px]">
            <div className="space-y-3">
              {filtrelenmisModuller.map(([key, modul]) => (
                <ModulCard key={key} modulKey={key} modulData={modul} isSelected={secilenModul === key} onClick={setSecilenModul} />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Sağ Panel - Modül Detayları */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  {React.createElement(rehber.modul.icon, {
                    className: 'h-6 w-6 text-primary',
                  })}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{rehber.modul.ad}</CardTitle>
                  <CardDescription className="text-base">{rehber.modul.aciklama}</CardDescription>
                </div>
                <Badge variant="secondary">{rehber.modul.kategori}</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs value={aktifTab} onValueChange={setAktifTab}>
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="genel">Genel</TabsTrigger>
                  <TabsTrigger value="ozellikler">Özellikler</TabsTrigger>
                  <TabsTrigger value="veri">Veri Modeli</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                  <TabsTrigger value="yetki">Yetkiler</TabsTrigger>
                  <TabsTrigger value="sorun">Sorun Giderme</TabsTrigger>
                </TabsList>

                <TabsContent value="genel" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Layers className="h-5 w-5" />
                          İlişkiler
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {rehber.iliskiler?.map((iliski, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{iliski.tip}</Badge>
                                <ChevronRight className="h-4 w-4" />
                                <span className="font-medium">{iliski.hedef}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{iliski.aciklama}</p>
                              {iliski.ornekler && (
                                <ul className="list-disc list-inside text-xs text-muted-foreground mt-2 ml-2">
                                  {iliski.ornekler.slice(0, 2).map((ornek, i) => (
                                    <li key={i}>{ornek}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          İpuçları & Öneriler
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {rehber.ipuclari.map((ipucu, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {ipucu}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {rehber.modul.bagimlilık && rehber.modul.bagimlilık.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Modül Bağımlılıkları
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 flex-wrap">
                          {rehber.modul.bagimlilık.map(bagimlilık => (
                            <Badge key={bagimlilık} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                              {bagimlilık}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">Bu modül yukarıdaki modüllerle ilişkilidir. İşlemler yaparken bu bağımlılıkları göz önünde bulundurun.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="ozellikler" className="mt-6">
                  <ScrollArea className=" pr-4">
                    <div className="space-y-4">
                      {rehber.ozellikler.map((ozellik, index) => (
                        <OzellikCard key={index} ozellik={ozellik} />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="veri" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5" />
                          {rehber.veri_modeli?.tablo_adi} Tablosu
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-3 font-medium">Alan Adı</th>
                                <th className="text-left p-3 font-medium">Tip</th>
                                <th className="text-left p-3 font-medium">Zorunlu</th>
                                <th className="text-left p-3 font-medium">Özellikler</th>
                                <th className="text-left p-3 font-medium">Açıklama</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rehber.veri_modeli?.alanlar.map((alan, index) => (
                                <tr key={index} className="border-b hover:bg-muted/50">
                                  <td className="p-3 font-mono text-sm">{alan.alan}</td>
                                  <td className="p-3">
                                    <Badge variant="outline">{alan.tip}</Badge>
                                  </td>
                                  <td className="p-3">
                                    <Badge variant={alan.zorunlu ? 'destructive' : 'secondary'}>{alan.zorunlu ? 'Evet' : 'Hayır'}</Badge>
                                  </td>
                                  <td className="p-3 text-sm">
                                    <div className="space-y-1">
                                      {alan.max_uzunluk && <div>Max: {alan.max_uzunluk}</div>}
                                      {alan.varsayilan && <div>Varsayılan: {alan.varsayilan}</div>}
                                      {alan.otomatik && (
                                        <Badge variant="secondary" className="text-xs">
                                          Otomatik
                                        </Badge>
                                      )}
                                      {alan.secenekler && <div className="text-xs text-muted-foreground">{alan.secenekler.join(', ')}</div>}
                                    </div>
                                  </td>
                                  <td className="p-3 text-sm text-muted-foreground">{alan.aciklama}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="api" className="mt-6">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Code className="h-5 w-5" />
                          API Endpoints
                        </CardTitle>
                        <CardDescription>Bu modül için kullanılabilir API endpointleri</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {rehber.api_endpoints.map((endpoint, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <Badge variant={endpoint.method === 'GET' ? 'secondary' : endpoint.method === 'POST' ? 'default' : endpoint.method === 'PUT' ? 'outline' : 'destructive'}>{endpoint.method}</Badge>
                                <code className="bg-muted px-2 py-1 rounded text-sm">{endpoint.endpoint}</code>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{endpoint.aciklama}</p>

                              {endpoint.parametreler && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium">Parametreler: </span>
                                  <div className="flex gap-1 flex-wrap mt-1">
                                    {endpoint.parametreler.map(param => (
                                      <Badge key={param} variant="outline" className="text-xs">
                                        {param}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {endpoint.gerekli_alanlar && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium">Gerekli Alanlar: </span>
                                  <div className="flex gap-1 flex-wrap mt-1">
                                    {endpoint.gerekli_alanlar.map(alan => (
                                      <Badge key={alan} variant="destructive" className="text-xs">
                                        {alan}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {endpoint.opsiyonel_alanlar && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium">Opsiyonel Alanlar: </span>
                                  <div className="flex gap-1 flex-wrap mt-1">
                                    {endpoint.opsiyonel_alanlar.map(alan => (
                                      <Badge key={alan} variant="secondary" className="text-xs">
                                        {alan}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {endpoint.sartlar && (
                                <div>
                                  <span className="text-sm font-medium">Şartlar: </span>
                                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 ml-4">
                                    {endpoint.sartlar.map((sart, i) => (
                                      <li key={i}>{sart}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="yetki" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Yetki Matrisi
                      </CardTitle>
                      <CardDescription>Kullanıcı rollerine göre işlem yetkileri</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3 font-medium">Rol</th>
                              <th className="text-center p-3 font-medium">Okuma</th>
                              <th className="text-center p-3 font-medium">Ekleme</th>
                              <th className="text-center p-3 font-medium">Güncelleme</th>
                              <th className="text-center p-3 font-medium">Silme</th>
                              <th className="text-center p-3 font-medium">Durum Değiştirme</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(rehber.yetki_matrisi).map(([rol, yetkiler]) => (
                              <tr key={rol} className="border-b hover:bg-muted/50">
                                <td className="p-3 font-medium">{rol}</td>
                                <td className="p-3 text-center">
                                  <Badge variant={yetkiler.okuma ? 'default' : 'secondary'}>{yetkiler.okuma ? '✓' : '✗'}</Badge>
                                </td>
                                <td className="p-3 text-center">
                                  <Badge variant={yetkiler.ekleme ? 'default' : 'secondary'}>{yetkiler.ekleme ? '✓' : '✗'}</Badge>
                                </td>
                                <td className="p-3 text-center">
                                  <Badge variant={yetkiler.guncelleme ? 'default' : 'secondary'}>{yetkiler.guncelleme ? '✓' : '✗'}</Badge>
                                </td>
                                <td className="p-3 text-center">
                                  <Badge variant={yetkiler.silme ? 'default' : 'secondary'}>{yetkiler.silme ? '✓' : '✗'}</Badge>
                                </td>
                                <td className="p-3 text-center">
                                  <Badge variant={yetkiler.durum_degistirme ? 'default' : 'secondary'}>{yetkiler.durum_degistirme ? '✓' : '✗'}</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sorun" className="mt-6">
                  <div className="space-y-6">
                    {rehber.ornekler && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-5 w-5" />
                              Başarılı Senaryolar
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {rehber.ornekler.basarili_senaryolar.map((senaryo, index) => (
                                <div key={index} className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/10">
                                  <h4 className="font-medium text-green-800 dark:text-green-200">{senaryo.senaryo}</h4>
                                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">{senaryo.adimlar}</p>
                                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">Sonuç: {senaryo.sonuc}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                              <AlertTriangle className="h-5 w-5" />
                              Hata Senaryoları
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {rehber.ornekler.hata_senaryolari?.map((hata, index) => (
                                <div key={index} className="p-3 border rounded-lg bg-red-50 dark:bg-red-900/10">
                                  <h4 className="font-medium text-red-800 dark:text-red-200">{hata.hata}</h4>
                                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">Sebep: {hata.sebep}</p>
                                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">Çözüm: {hata.cozum}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Sorun Giderme
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {rehber.sorun_giderme.map((sorun, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <h4 className="font-medium mb-3 text-orange-600">{sorun.problem}</h4>
                              <div>
                                <span className="text-sm font-medium">Çözümler:</span>
                                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 ml-4">
                                  {sorun.cozumler.map((cozum, i) => (
                                    <li key={i}>{cozum}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {rehber.performans && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Performans Notları
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2 text-blue-600">Optimizasyonlar</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {rehber.performans.optimizasyonlar.map((opt, index) => (
                                  <li key={index}>{opt}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2 text-orange-600">Limitler</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {rehber.performans.limitler.map((limit, index) => (
                                  <li key={index}>{limit}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Son Güncelleme: {rehber.son_guncelleme} | Hazırlayan: {rehber.hazırlayan}
            </div>
            <Badge variant="outline">Versiyon {rehber.versiyon}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RehberPage;
