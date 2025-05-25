import { LayoutDashboard, Users, Package, ShieldCheck, Route, Settings, FileText, Briefcase, Layers,Building } from 'lucide-react'; // Yeni ikonlar eklendi

export const NavMainData = [
  {
    to: '/',
    label: 'Anasayfa',
    icon: LayoutDashboard,
  },
  {
    to: '/personeller', // Eğer bu direkt bir sayfa değilse ve altında menü varsa, 'to' gerekmeyebilir
    label: 'Personeller',
    icon: Users,
    isDropdown: true, // Bu bir dropdown menü olacak
    children: [
      {
        to: '/personeller/liste',
        label: 'Personel Listesi',
        icon: Users, // Alt menü için de ikon olabilir
      },
      {
        to: '/personeller/roller',
        label: 'Roller ve Yetkiler',
        icon: ShieldCheck,
      },
      {
        to: '/personeller/departmanlar',
        label: 'Departmanlar',
        icon: Briefcase, // Briefcase ikonunu iconMap'e eklemeyi unutmayın
      },
    ],
  },
  {
    to: '/malzemeler',
    label: 'Malzemeler',
    icon: Package,
  },
  {
    to: '/malzeme-hareketleri',
    label: 'Malzeme Hareketleri',
    icon: Route,
  },
  {
    label: 'Tanımlar',
    icon: Layers,
    isDropdown: true,
    children: [
      {
        to: '/birim',
        label: 'Birim',
        icon: Building,
      },
    ],
  },
  {
    label: 'Ayarlar',
    icon: Settings,
    isDropdown: true,
    children: [
      {
        to: '/ayarlar/genel',
        label: 'Genel Ayarlar',
        icon: Settings,
      },
      {
        to: '/ayarlar/raporlar',
        label: 'Rapor Şablonları',
        icon: FileText,
      },
    ],
  },
];
