// client/src/pages/dashboard/index.jsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Package,
  Users,
  Warehouse,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Activity,
  BarChart3,
  Calendar,
  Settings,
  Plus,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

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
    performansMetrikleri: {}
  });

  // Store'lardan veri çek
  const malzemeler = Malzeme_Store(state => state.datas);
  const getMalzemeler = Malzeme_Store(state => state.GetByQuery);
  const getStatistics = Malzeme_Store(state => state.GetStatistics);

  const hareketler = MalzemeHareket_Store(state => state.datas);
  const getHareketler = MalzemeHareket_Store(state => state.GetByQuery);

  const personeller = Personel_Store(state => state.datas);
  const getPersoneller = Personel_Store(state => state.GetAll);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Temel verileri yükle
        await Promise.all([
          getMalzemeler({ showToast: false }),
          getHareketler({ showToast: false }),
          getPersoneller({ showToast: false })
        ]);
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

      // Son 10 hareketi al
      const sonHareketler = hareketler
        .sort((a, b) => new Date(b.islemTarihi) - new Date(a.islemTarihi))
        .slice(0, 10);

      // Malzeme dağılımı
      const malzemeDagilimi = {
        demirbas: statistics.demirbasCount,
        sarf: statistics.sarfCount,
        zimmetli: statistics.zimmetliCount,
        depoda: statistics.depodaCount,
        kayip: statistics.kayipCount
      };

      setStats({
        ...statistics,
        sonHareketler,
        malzemeDagilimi,
        performansMetrikleri: {
          gunlukHareket: hareketler.filter(h => {
            const today = new Date();
            const hareketTarihi = new Date(h.islemTarihi);
            return hareketTarihi.toDateString() === today.toDateString();
          }).length,
          haftalikHareket: hareketler.filter(h => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(h.islemTarihi) >= weekAgo;
          }).length,
          toplamPersonel: personeller.length
        }
      });
    }
  }, [malzemeler, hareketler, personeller, getStatistics]);

  const StatCard = ({ title, value, description, icon: Icon, trend, trendValue, color = "default" }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color === 'success' ? 'text-green-600' :
          color === 'warning' ? 'text-yellow-600' :
            color === 'danger' ? 'text-red-600' :
              color === 'info' ? 'text-blue-600' :
                'text-muted-foreground'
          }`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString('tr-TR')}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            <span className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon: Icon, onClick, variant = "default" }) => (
    <Card className="cursor-pointer transition-all hover:shadow-md group" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${variant === 'primary' ? 'bg-primary/10 text-primary' :
            variant === 'success' ? 'bg-green-100 text-green-600' :
              variant === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                'bg-muted text-muted-foreground'
            }`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium group-hover:text-primary transition-colors">
              {title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardContent>
    </Card>
  );

  const HareketListItem = ({ hareket }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {hareket.malzeme?.vidaNo?.substring(0, 2) || 'ML'}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">
            {hareket.malzeme?.vidaNo || 'Bilinmeyen Malzeme'}
          </p>
          <p className="text-xs text-muted-foreground">
            {hareket.hedefPersonel?.ad || hareket.kaynakPersonel?.ad || 'Sistem'}
          </p>
        </div>
      </div>
      <div className="text-right">
        <Badge variant={
          hareket.hareketTuru === 'Zimmet' ? 'destructive' :
            hareket.hareketTuru === 'Iade' ? 'success' :
              hareket.hareketTuru === 'Devir' ? 'warning' :
                'secondary'
        } className="text-xs">
          {hareket.hareketTuru}
        </Badge>
        <p className="text-xs text-muted-foreground mt-1">
          {format(new Date(hareket.islemTarihi), 'HH:mm', { locale: tr })}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 animate-pulse" />
          <span>Dashboard yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mx-auto gap-6">

      <div>


        {/* Hoş Geldin Başlığı */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hoş geldin, {user?.name || 'Kullanıcı'}! 👋
            </h1>
            <p className="text-muted-foreground">
              {format(new Date(), 'dd MMMM yyyy, EEEE', { locale: tr })} - Malzeme Yönetim Sistemine Genel Bakış
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Ara
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Malzeme
            </Button>
          </div>
        </div>

        {/* Ana İstatistikler */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-6">
          <StatCard
            title="Toplam Malzeme"
            value={stats.totalMalzeme}
            description="Sistemdeki toplam malzeme sayısı"
            icon={Package}
            color="info"
          />
          <StatCard
            title="Zimmetli Malzemeler"
            value={stats.zimmetliCount}
            description="Personelde zimmetli"
            icon={Users}
            color="warning"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Depodaki Malzemeler"
            value={stats.depodaCount}
            description="Depoda mevcut"
            icon={Warehouse}
            color="success"
          />
          <StatCard
            title="Kayıp Malzemeler"
            value={stats.kayipCount}
            description="Kayıp veya düşüm"
            icon={AlertTriangle}
            color="danger"
          />
        </div>

        {/* Orta Bölüm: Grafikler ve Hızlı İşlemler */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-6">
          {/* Malzeme Dağılımı */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Malzeme Dağılımı
              </CardTitle>
              <CardDescription>
                Malzemelerin durumlarına göre dağılımı
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Zimmetli Malzemeler</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.zimmetliCount} / {stats.totalMalzeme}
                  </span>
                </div>
                <Progress
                  value={(stats.zimmetliCount / stats.totalMalzeme) * 100}
                  className="h-2"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Depodaki Malzemeler</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.depodaCount} / {stats.totalMalzeme}
                  </span>
                </div>
                <Progress
                  value={(stats.depodaCount / stats.totalMalzeme) * 100}
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.demirbasCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Demirbaş</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.sarfCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Sarf Malzeme</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hızlı İşlemler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Hızlı İşlemler
              </CardTitle>
              <CardDescription>
                Sık kullanılan işlemler
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickActionCard
                title="Yeni Malzeme"
                description="Sisteme malzeme ekle"
                icon={Package}
                variant="primary"
                onClick={() => console.log('Yeni malzeme ekleme')}
              />
              <QuickActionCard
                title="Zimmet Ver"
                description="Personele zimmet ver"
                icon={Users}
                variant="warning"
                onClick={() => console.log('Zimmet verme')}
              />
              <QuickActionCard
                title="İade Al"
                description="Malzeme iade al"
                icon={CheckCircle}
                variant="success"
                onClick={() => console.log('İade alma')}
              />
              <QuickActionCard
                title="Raporlar"
                description="Detaylı raporları görüntüle"
                icon={BarChart3}
                onClick={() => console.log('Raporlar')}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div>


        {/* Alt Bölüm: Son Hareketler ve Performans */}
        <div className="grid gap-6 md:grid-row-2">
          {/* Son Hareketler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Son Hareketler
              </CardTitle>
              <CardDescription>
                En son gerçekleştirilen malzeme hareketleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {stats.sonHareketler.length > 0 ? (
                  stats.sonHareketler.map((hareket) => (
                    <div key={hareket.id}>
                      <HareketListItem hareket={hareket} />
                      {stats.sonHareketler.indexOf(hareket) < stats.sonHareketler.length - 1 && (
                        <Separator />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Henüz hareket kaydı bulunmuyor.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performans Metrikleri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performans Metrikleri
              </CardTitle>
              <CardDescription>
                Sistem kullanım istatistikleri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Günlük Aktivite */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bugünkü Hareketler</span>
                  <Badge variant="secondary">
                    {stats.performansMetrikleri.gunlukHareket}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Son 24 saat içinde
                </div>
              </div>

              <Separator />

              {/* Haftalık Aktivite */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Haftalık Hareketler</span>
                  <Badge variant="outline">
                    {stats.performansMetrikleri.haftalikHareket}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Son 7 gün içinde
                </div>
              </div>

              <Separator />

              {/* Aktif Personel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Toplam Personel</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {stats.performansMetrikleri.toplamPersonel}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  Sisteme kayıtlı
                </div>
              </div>

              {/* Sistem Durumu */}
              <div className="pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Sistem Normal Çalışıyor</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tüm servisler aktif ve kullanıma hazır
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}