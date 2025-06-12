// client/src/app/globalSearch/pages/GlobalSearchPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { GlobalSearchComponent } from '../components/GlobalSearchComponent';
import { QuickSearchComponent } from '../components/QuickSearchComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllEntityTypes, getEntityConfig } from '../helpers/entityConfig';

export const GlobalSearchPage = () => {
  const navigate = useNavigate();

  // Handle search result selection
  const handleSearchResultSelect = (item, entityType) => {
    console.log('Selected item:', item, 'Type:', entityType);
    
    // Entity tipine göre navigasyon
    switch (entityType) {
      case 'malzeme':
        navigate(`/malzeme?highlight=${item.id}`);
        toast.success(`${item.vidaNo || item.kod} malzemesi seçildi`);
        break;
      case 'birim':
        navigate(`/birim?highlight=${item.id}`);
        toast.success(`${item.ad} birimi seçildi`);
        break;
      case 'personel':
        navigate(`/personel?highlight=${item.id}`);
        toast.success(`${item.ad} ${item.soyad} personeli seçildi`);
        break;
      case 'sube':
        navigate(`/sube?highlight=${item.id}`);
        toast.success(`${item.ad} şubesi seçildi`);
        break;
      case 'buro':
        navigate(`/buro?highlight=${item.id}`);
        toast.success(`${item.ad} bürosu seçildi`);
        break;
      case 'marka':
        navigate(`/marka?highlight=${item.id}`);
        toast.success(`${item.ad} markası seçildi`);
        break;
      case 'model':
        navigate(`/model?highlight=${item.id}`);
        toast.success(`${item.ad} modeli seçildi`);
        break;
      case 'depo':
        navigate(`/depo?highlight=${item.id}`);
        toast.success(`${item.ad} deposu seçildi`);
        break;
      case 'konum':
        navigate(`/konum?highlight=${item.id}`);
        toast.success(`${item.ad} konumu seçildi`);
        break;
      case 'sabitKodu':
        navigate(`/sabitkodu?highlight=${item.id}`);
        toast.success(`${item.ad} sabit kodu seçildi`);
        break;
      case 'malzemeHareket':
        navigate(`/malzeme-hareket?highlight=${item.id}`);
        toast.success(`Malzeme hareketi seçildi`);
        break;
      default:
        toast.info(`${entityType} seçildi: ${item.ad || item.id}`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Global Arama</h1>
        <p className="text-muted-foreground">
          Sistem genelindeki tüm kayıtlarda arama yapın ve hızlıca bulun
        </p>
      </div>

      {/* Ana Arama Componenti */}
      <Card>
        <CardHeader>
          <CardTitle>Genel Arama</CardTitle>
        </CardHeader>
        <CardContent>
          <GlobalSearchComponent
            placeholder="Tüm kayıtlarda ara..."
            onResultSelect={handleSearchResultSelect}
            enableContextMenu={true}
            showStats={true}
            autoFocus={true}
            className="max-w-4xl mx-auto"
          />
        </CardContent>
      </Card>

      {/* Hızlı Arama */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı Arama</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickSearchComponent
            placeholder="Hızlı ara..."
            onResultSelect={handleSearchResultSelect}
            limit={10}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Kategori Bazlı Arama Örnekleri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Malzeme Arama</CardTitle>
          </CardHeader>
          <CardContent>
            <GlobalSearchComponent
              placeholder="Malzeme ara..."
              entityTypes={['malzeme']}
              onResultSelect={handleSearchResultSelect}
              enableContextMenu={true}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personel Arama</CardTitle>
          </CardHeader>
          <CardContent>
            <GlobalSearchComponent
              placeholder="Personel ara..."
              entityTypes={['personel']}
              onResultSelect={handleSearchResultSelect}
              enableContextMenu={false}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizasyon Arama</CardTitle>
          </CardHeader>
          <CardContent>
            <GlobalSearchComponent
              placeholder="Birim, şube, büro ara..."
              entityTypes={['birim', 'sube', 'buro']}
              onResultSelect={handleSearchResultSelect}
              enableContextMenu={true}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ürün Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <GlobalSearchComponent
              placeholder="Marka, model ara..."
              entityTypes={['marka', 'model']}
              onResultSelect={handleSearchResultSelect}
              enableContextMenu={false}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>

      {/* Aranabilir Kategoriler */}
      <Card>
        <CardHeader>
          <CardTitle>Aranabilir Kategoriler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getAllEntityTypes().map(entityType => {
              const config = getEntityConfig(entityType);
              const Icon = config.icon;
              
              return (
                <div key={entityType} className="flex items-center gap-2 p-3 border rounded-lg">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <div>
                    <div className="font-medium text-sm">{config.label}</div>
                    <div className="text-xs text-muted-foreground">{config.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Kullanım İpuçları */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanım İpuçları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Arama Teknikleri</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• En az 2 karakter girdiğinizde arama başlar</li>
                  <li>• Kısmi eşleştirmeler desteklenir</li>
                  <li>• Türkçe karakter desteği vardır</li>
                  <li>• Büyük/küçük harf duyarlı değildir</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Context Menu İşlemleri</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Malzeme sonuçlarında sağ tık: Zimmet, İade, Devir</li>
                  <li>• Birim sonuçlarında sağ tık: Detay, Düzenle</li>
                  <li>• Personel sonuçlarında sağ tık: Profil, Zimmetler</li>
                  <li>• Diğer kategoriler: Detay görüntüleme</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-primary/5 rounded-lg">
              <h4 className="font-medium mb-2">Performans İpuçları</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Belirli kategorilerde arama yapmak daha hızlı sonuç verir</p>
                <p>• Hızlı arama, en popüler kategorilerde sonuç gösterir</p>
                <p>• Son aramalarınız kaydedilir ve hızlı erişim sağlar</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};