// client/src/pages/dashboard/index.jsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Package, Users, Warehouse, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, ArrowUpRight, Activity, BarChart3, CalendarIcon, Settings, Plus, Search, MapPin, User, Building2, Timer, Target, Zap, FileText, Calendar, ArrowRight, DollarSign, Percent } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
// import { GlobalSearchComponent } from '@/components/GlobalSearchComponent';
// import  ExampleUsage  from '@/components/ExampleUsage';
// Store'ları import et
import { Malzeme_Store } from '@/app/malzeme/constants/store';
import { MalzemeHareket_Store } from '@/app/malzemeHareket/constants/store';
import { Personel_Store } from '@/app/personel/constants/store';
import { useAuthStore } from '@/stores/authStore';

export function DashboardPage() {
  const user = useAuthStore(state => state.user);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMalzeme: 0,
    zimmetliMalzeme: 0,
    depodakiMalzeme: 0,
    kayipMalzeme: 0,
    sonHareketler: [],
    malzemeDagilimi: {},
    performansMetrikleri: {},
    detayliIstatistikler: {},
  });

  // Store'lardan veri çek
  const malzemeler = Malzeme_Store(state => state.datas);
  const getMalzemeler = Malzeme_Store(state => state.GetByQuery);
  const getStatistics = Malzeme_Store(state => state.GetStatistics);

  const hareketler = MalzemeHareket_Store(state => state.datas);
  const getHareketler = MalzemeHareket_Store(state => state.GetByQuery);

  const personeller = Personel_Store(state => state.datas);
  const getPersoneller = Personel_Store(state => state.GetAll);

  // Badge variant helper
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
        return 'info';
      case 'Kayip':
        return 'destructive';
      case 'Dusum':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await Promise.all([getMalzemeler({ status: 'Aktif' }, { showToast: false }), getHareketler({ showToast: false }), getPersoneller({ showToast: false })]);
      } catch (error) {
        console.error('Dashboard veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    if (malzemeler.length > 0) {
      const statistics = getStatistics();
      const now = new Date();

      // Tarih aralıkları
      const today = new Date();
      const yesterday = subDays(today, 1);
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);

      // Hareketleri tarihlere göre filtrele
      const bugunHareketler = hareketler.filter(h => new Date(h.islemTarihi).toDateString() === today.toDateString());
      const dunHareketler = hareketler.filter(h => new Date(h.islemTarihi).toDateString() === yesterday.toDateString());
      const haftalikHareketler = hareketler.filter(h => {
        const tarih = new Date(h.islemTarihi);
        return tarih >= weekStart && tarih <= weekEnd;
      });
      const aylikHareketler = hareketler.filter(h => {
        const tarih = new Date(h.islemTarihi);
        return tarih >= monthStart && tarih <= monthEnd;
      });

      // Hareket türü istatistikleri
      const hareketTuruStats = hareketler.reduce((acc, hareket) => {
        acc[hareket.hareketTuru] = (acc[hareket.hareketTuru] || 0) + 1;
        return acc;
      }, {});

      // En aktif personeller
      const personelAktivite = hareketler.reduce((acc, hareket) => {
        const personel = hareket.hedefPersonel?.ad || hareket.kaynakPersonel?.ad;
        if (personel) {
          acc[personel] = (acc[personel] || 0) + 1;
        }
        return acc;
      }, {});

      // Zimmet durumu analizi
      const zimmetliPersoneller = [
        ...new Set(
          hareketler
            .filter(h => h.hareketTuru === 'Zimmet')
            .map(h => h.hedefPersonel?.ad)
            .filter(Boolean),
        ),
      ];

      const sonHareketler = hareketler.sort((a, b) => new Date(b.islemTarihi) - new Date(a.islemTarihi)).slice(0, 5);

      setStats({
        ...statistics,
        sonHareketler,
        performansMetrikleri: {
          gunlukHareket: bugunHareketler.length,
          dunHareket: dunHareketler.length,
          haftalikHareket: haftalikHareketler.length,
          aylikHareket: aylikHareketler.length,
          toplamPersonel: personeller.length,
          zimmetliPersonelSayisi: zimmetliPersoneller.length,
        },
        detayliIstatistikler: {
          hareketTuruStats,
          personelAktivite: Object.entries(personelAktivite)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5),
          malzemeKategorileri: {
            demirbas: statistics.demirbasCount,
            sarf: statistics.sarfCount,
          },
          verimlilikMetrikleri: {
            gunlukOrtalama: Math.round(haftalikHareketler.length / 7),
            haftalikArtis:
              haftalikHareketler.length -
              hareketler.filter(h => {
                const tarih = new Date(h.islemTarihi);
                const prevWeekStart = subDays(weekStart, 7);
                const prevWeekEnd = subDays(weekEnd, 7);
                return tarih >= prevWeekStart && tarih <= prevWeekEnd;
              }).length,
            zimmetOrani: Math.round((statistics.zimmetliCount / statistics.totalMalzeme) * 100),
            depoKapasite: Math.round((statistics.depodaCount / statistics.totalMalzeme) * 100),
          },
        },
      });
    }
  }, [malzemeler, hareketler, personeller, getStatistics]);

  const StatCard = ({ title, value, description, icon: Icon, trend, trendValue, className, iconColor = 'muted' }) => {
    const getIconColorClass = color => {
      switch (color) {
        case 'blue':
          return 'text-blue-600 dark:text-blue-400';
        case 'green':
          return 'text-green-600 dark:text-green-400';
        case 'orange':
          return 'text-orange-600 dark:text-orange-400';
        case 'red':
          return 'text-red-600 dark:text-red-400';
        case 'purple':
          return 'text-purple-600 dark:text-purple-400';
        case 'yellow':
          return 'text-yellow-600 dark:text-yellow-400';
        case 'indigo':
          return 'text-indigo-600 dark:text-indigo-400';
        default:
          return 'text-muted-foreground';
      }
    };

    return (
      <Card className={cn('transition-all duration-200 hover:shadow-md', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className={cn('h-4 w-4', getIconColorClass(iconColor))} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? <TrendingUp className="h-3 w-3 text-green-600" /> : trend === 'down' ? <TrendingDown className="h-3 w-3 text-red-600" /> : <ArrowRight className="h-3 w-3 text-gray-500" />}
              <span className={cn('text-xs', trend === 'up' && 'text-green-600', trend === 'down' && 'text-red-600', trend === 'neutral' && 'text-gray-500')}>{trendValue}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  const HareketListItem = ({ hareket }) => (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-muted">{hareket.malzeme?.vidaNo?.substring(0, 2) || 'ML'}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">{hareket.malzeme?.vidaNo || 'Bilinmeyen Malzeme'}</p>
          <p className="text-xs text-muted-foreground">{hareket.hedefPersonel?.ad || hareket.kaynakPersonel?.ad || 'Sistem'}</p>
        </div>
      </div>
      <div className="text-right space-y-1">
        <Badge variant={getHareketTuruVariant(hareket.hareketTuru)} className="text-xs">
          {hareket.hareketTuru}
        </Badge>
        <p className="text-xs text-muted-foreground">{format(new Date(hareket.islemTarihi), 'dd/MM HH:mm', { locale: tr })}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto py-6 space-y-6">

      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hoş geldin, {user?.name || 'Kullanıcı'}! 👋</h1>
          <p className="text-muted-foreground">{format(new Date(), 'dd MMMM yyyy, EEEE', { locale: tr })} - Malzeme Yönetim Sistemi</p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Ara
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Malzeme
          </Button>
        </div> */}
      </div>
      {/* <ExampleUsage /> */}
      {/* <GlobalSearchComponent entityTypes={['birim', 'personel', 'malzeme']} placeholder="Birim, personel ve malzemelerde ara..." /> */}
      {/* <HeaderSearchComponent /> */}

      {/* Ana İstatistikler */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Toplam Malzeme" value={stats.totalMalzeme?.toLocaleString('tr-TR') || '0'} description="Sistemdeki toplam malzeme" icon={Package} iconColor="blue" />
        <StatCard title="Zimmetli Malzemeler" value={stats.zimmetliCount?.toLocaleString('tr-TR') || '0'} description={`${stats.performansMetrikleri?.zimmetliPersonelSayisi || 0} personelde`} icon={Users} iconColor="orange" trend="up" trendValue={`${stats.detayliIstatistikler?.verimlilikMetrikleri?.zimmetOrani || 0}%`} />
        <StatCard title="Depodaki Malzemeler" value={stats.depodaCount?.toLocaleString('tr-TR') || '0'} description="Depoda mevcut" icon={Warehouse} iconColor="green" trend="neutral" trendValue={`${stats.detayliIstatistikler?.verimlilikMetrikleri?.depoKapasite || 0}% kapasite`} />
        <StatCard title="Kayıp/Düşüm" value={stats.kayipCount?.toLocaleString('tr-TR') || '0'} description="Kritik durumlar" icon={AlertTriangle} iconColor="red" />
      </div>
      {/* Performans Metrikleri */}
      {/* <div className="grid gap-4 md:grid-cols-5">
        <StatCard
          title="Bugünkü Hareketler"
          value={stats.performansMetrikleri?.gunlukHareket || 0}
          description="Son 24 saat"
          icon={Timer}
          iconColor="blue"
          trend={stats.performansMetrikleri?.gunlukHareket > stats.performansMetrikleri?.dunHareket ? 'up' : 'down'}
          trendValue={`Dün: ${stats.performansMetrikleri?.dunHareket || 0}`}
        />
        <StatCard
          title="Haftalık Hareketler"
          value={stats.performansMetrikleri?.haftalikHareket || 0}
          description="Bu hafta toplam"
          icon={Calendar}
          iconColor="green"
          trend={stats.detayliIstatistikler?.verimlilikMetrikleri?.haftalikArtis > 0 ? 'up' : 'down'}
          trendValue={`${stats.detayliIstatistikler?.verimlilikMetrikleri?.haftalikArtis > 0 ? '+' : ''}${stats.detayliIstatistikler?.verimlilikMetrikleri?.haftalikArtis || 0}`}
        />
        <StatCard title="Günlük Ortalama" value={stats.detayliIstatistikler?.verimlilikMetrikleri?.gunlukOrtalama || 0} description="Haftalık ortalaması" icon={Target} iconColor="purple" />
        <StatCard title="Aylık Hareketler" value={stats.performansMetrikleri?.aylikHareket || 0} description="Bu ay toplam" icon={BarChart3} iconColor="indigo" />
        <StatCard
          title="Aktif Personel"
          value={stats.performansMetrikleri?.zimmetliPersonelSayisi || 0}
          description="Malzeme kullananlar"
          icon={Users}
          iconColor="orange"
          trend="neutral"
          trendValue={`${stats.performansMetrikleri?.toplamPersonel || 0} toplam`}
        />
      </div> */}
      {/* Detaylı Analiz Metrikleri */}
      {/* <div className="grid gap-4 md:grid-cols-6">
        <StatCard title="Zimmet Oranı" value={`%${stats.detayliIstatistikler?.verimlilikMetrikleri?.zimmetOrani || 0}`} description="Toplam malzemeden" icon={Percent} iconColor="orange" />
        <StatCard title="Depo Doluluk" value={`%${stats.detayliIstatistikler?.verimlilikMetrikleri?.depoKapasite || 0}`} description="Depo kapasitesi" icon={Warehouse} iconColor="green" />
        <StatCard title="Ortalama İşlem" value={Math.round((stats.performansMetrikleri?.aylikHareket || 0) / 30) || 0} description="Günlük işlem sayısı" icon={Activity} iconColor="blue" />
        <StatCard title="En Çok Hareket" value={Math.max(...Object.values(stats.detayliIstatistikler?.hareketTuruStats || { 0: 0 }))} description="Tek hareket türünde" icon={TrendingUp} iconColor="purple" />
        <StatCard title="Kritik Oran" value={`%${Math.round(((stats.kayipCount || 0) / (stats.totalMalzeme || 1)) * 100)}`} description="Kayıp/Düşüm oranı" icon={AlertTriangle} iconColor="red" />
        <StatCard title="İşlem Sıklığı" value={`${Math.round(((stats.performansMetrikleri?.haftalikHareket || 0) / 7) * 10) / 10}`} description="Günlük ortalama" icon={Zap} iconColor="yellow" />
      </div> */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sol Kolon */}
        <div className="lg:col-span-2 space-y-6">
          {/* Malzeme Dağılımı */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Malzeme Dağılımı
              </CardTitle>
              <CardDescription>Durumlarına göre malzeme dağılımı</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Zimmetli Malzemeler</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.zimmetliCount} / {stats.totalMalzeme} (%{Math.round((stats.zimmetliCount / stats.totalMalzeme) * 100)})
                  </span>
                </div>
                <Progress value={(stats.zimmetliCount / stats.totalMalzeme) * 100} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Depodaki Malzemeler</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.depodaCount} / {stats.totalMalzeme} (%{Math.round((stats.depodaCount / stats.totalMalzeme) * 100)})
                  </span>
                </div>
                <Progress value={(stats.depodaCount / stats.totalMalzeme) * 100} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{stats.detayliIstatistikler?.malzemeKategorileri?.demirbas || 0}</div>
                  <div className="text-xs text-muted-foreground">Demirbaş</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{stats.detayliIstatistikler?.malzemeKategorileri?.sarf || 0}</div>
                  <div className="text-xs text-muted-foreground">Sarf Malzeme</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{stats.kayipCount || 0}</div>
                  <div className="text-xs text-muted-foreground">Kayıp/Düşüm</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Malzeme Kategori Detayları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                Malzeme Kategori Analizi
              </CardTitle>
              <CardDescription>Kategorilere göre detaylı malzeme durumu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Demirbaş Malzemeler</span>
                    <span className="text-sm text-muted-foreground">{stats.detayliIstatistikler?.malzemeKategorileri?.demirbas || 0}</span>
                  </div>
                  <Progress value={((stats.detayliIstatistikler?.malzemeKategorileri?.demirbas || 0) / (stats.totalMalzeme || 1)) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Sarf Malzemeler</span>
                    <span className="text-sm text-muted-foreground">{stats.detayliIstatistikler?.malzemeKategorileri?.sarf || 0}</span>
                  </div>
                  <Progress value={((stats.detayliIstatistikler?.malzemeKategorileri?.sarf || 0) / (stats.totalMalzeme || 1)) * 100} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold">{Math.round(((stats.zimmetliCount || 0) / (stats.detayliIstatistikler?.malzemeKategorileri?.demirbas || 1)) * 100)}%</div>
                  <div className="text-xs text-muted-foreground">Demirbaş Zimmet</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold">{Math.round(((stats.depodaCount || 0) / (stats.detayliIstatistikler?.malzemeKategorileri?.sarf || 1)) * 100)}%</div>
                  <div className="text-xs text-muted-foreground">Sarf Stok</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold">{stats.performansMetrikleri?.zimmetliPersonelSayisi || 0}</div>
                  <div className="text-xs text-muted-foreground">Kullanıcı</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold">{(stats.performansMetrikleri?.toplamPersonel || 0) - (stats.performansMetrikleri?.zimmetliPersonelSayisi || 0)}</div>
                  <div className="text-xs text-muted-foreground">Pasif Personel</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Haftalık Trend Analizi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Haftalık Trend Analizi
              </CardTitle>
              <CardDescription>Son 7 günün hareket analizi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-green-600">{stats.detayliIstatistikler?.hareketTuruStats?.Iade || 0}</div>
                    <div className="text-xs text-muted-foreground">İade İşlemleri</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{stats.detayliIstatistikler?.hareketTuruStats?.Zimmet || 0}</div>
                    <div className="text-xs text-muted-foreground">Zimmet İşlemleri</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{stats.detayliIstatistikler?.hareketTuruStats?.DepoTransferi || 0}</div>
                    <div className="text-xs text-muted-foreground">Depo Transferi</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">İade/Zimmet Oranı</span>
                    <span className="text-sm font-semibold">{Math.round(((stats.detayliIstatistikler?.hareketTuruStats?.Iade || 0) / (stats.detayliIstatistikler?.hareketTuruStats?.Zimmet || 1)) * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Günlük İşlem Yoğunluğu</span>
                    <span className="text-sm font-semibold">{stats.performansMetrikleri?.haftalikHareket && stats.performansMetrikleri.haftalikHareket > 35 ? 'Yüksek' : stats.performansMetrikleri?.haftalikHareket && stats.performansMetrikleri.haftalikHareket > 14 ? 'Orta' : 'Düşük'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Haftalık Verimlilik</span>
                    <span className="text-sm font-semibold">{stats.detayliIstatistikler?.verimlilikMetrikleri?.haftalikArtis >= 0 ? '📈 Artış' : '📉 Azalış'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performans & Verimlilik Metrikleri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Performans & Verimlilik Analizi
              </CardTitle>
              <CardDescription>Detaylı sistem performans göstergeleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">İşlem Metrikleri</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="text-sm">Toplam İşlem</span>
                      <Badge variant="secondary">{hareketler.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="text-sm">Başarı Oranı</span>
                      <Badge variant="secondary">%{Math.round(((hareketler.length - (stats.kayipCount || 0)) / (hareketler.length || 1)) * 100)}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="text-sm">Ortalama/Gün</span>
                      <Badge variant="secondary">{Math.round(((stats.performansMetrikleri?.aylikHareket || 0) / 30) * 10) / 10}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Kaynak Kullanımı</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="text-sm">Personel Aktivitesi</span>
                      <Badge variant="secondary">%{Math.round(((stats.performansMetrikleri?.zimmetliPersonelSayisi || 0) / (stats.performansMetrikleri?.toplamPersonel || 1)) * 100)}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="text-sm">Malzeme Deviri</span>
                      <Badge variant="secondary">%{Math.round(((stats.detayliIstatistikler?.hareketTuruStats?.Devir || 0) / (hareketler.length || 1)) * 100)}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="text-sm">Kritik Durum</span>
                      <Badge variant={stats.kayipCount > 0 ? 'destructive' : 'secondary'}>%{Math.round(((stats.kayipCount || 0) / (stats.totalMalzeme || 1)) * 100)}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold">{stats.detayliIstatistikler?.hareketTuruStats?.KondisyonGuncelleme || 0}</div>
                  <div className="text-xs text-muted-foreground">Kondisyon Güncelleme</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold">{Math.round((stats.performansMetrikleri?.haftalikHareket || 0) / 7)}</div>
                  <div className="text-xs text-muted-foreground">Günlük Hedef</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold">{(stats.detayliIstatistikler?.personelAktivite || []).length}</div>
                  <div className="text-xs text-muted-foreground">Aktif Kullanıcı</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold">{Math.max(0, 100 - Math.round(((stats.kayipCount || 0) / (stats.totalMalzeme || 1)) * 100))}%</div>
                  <div className="text-xs text-muted-foreground">Sağlık Skoru</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Kolon */}
        <div className="space-y-6">
          {/* Son Hareketler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                Son Hareketler
              </CardTitle>
              <CardDescription>En son gerçekleştirilen işlemler</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {stats.sonHareketler.length > 0 ? (
                  stats.sonHareketler.map(hareket => <HareketListItem key={hareket.id} hareket={hareket} />)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Henüz hareket kaydı bulunmuyor.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hızlı İşlemler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                Hızlı İşlemler
              </CardTitle>
              <CardDescription>Sık kullanılan işlemler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Package className="h-4 w-4 mr-2 text-blue-600" />
                Yeni Malzeme Ekle
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Users className="h-4 w-4 mr-2 text-orange-600" />
                Zimmet Ver
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                İade Al
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 mr-2 text-purple-600" />
                Raporlar
              </Button>
            </CardContent>
          </Card>

          {/* Sistem Durumu & Detaylı Metrikler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Sistem Durumu & Ayrıntılı Metrikler
              </CardTitle>
              <CardDescription>Kapsamlı sistem analizi ve durum bilgileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Personel Analizi</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                      <span className="text-sm">Toplam Personel</span>
                      <Badge variant="secondary">{stats.performansMetrikleri?.toplamPersonel || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded">
                      <span className="text-sm">Aktif Kullanıcı</span>
                      <Badge variant="secondary">{stats.performansMetrikleri?.zimmetliPersonelSayisi || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-950/20 rounded">
                      <span className="text-sm">Pasif Personel</span>
                      <Badge variant="outline">{(stats.performansMetrikleri?.toplamPersonel || 0) - (stats.performansMetrikleri?.zimmetliPersonelSayisi || 0)}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">İşlem Dağılımı</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                      <span className="text-sm">Zimmet İşlemleri</span>
                      <Badge variant="secondary">{stats.detayliIstatistikler?.hareketTuruStats?.Zimmet || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded">
                      <span className="text-sm">İade İşlemleri</span>
                      <Badge variant="secondary">{stats.detayliIstatistikler?.hareketTuruStats?.Iade || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                      <span className="text-sm">Transfer İşlemleri</span>
                      <Badge variant="secondary">{stats.detayliIstatistikler?.hareketTuruStats?.DepoTransferi || 0}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm">En Aktif Personeller</h4>
                <div className="space-y-2">
                  {(stats.detayliIstatistikler?.personelAktivite || []).slice(0, 3).map(([personel, hareket], index) => (
                    <div key={personel} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">{index + 1}</div>
                        <span className="text-sm font-medium">{personel}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {hareket} işlem
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Sistem Normal Çalışıyor</span>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Sağlık Skoru: {Math.max(0, 100 - Math.round(((stats.kayipCount || 0) / (stats.totalMalzeme || 1)) * 100))}% • Uptime: 99.9% • Son Güncelleme: {format(new Date(), 'HH:mm', { locale: tr })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
