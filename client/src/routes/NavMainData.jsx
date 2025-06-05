// Navigation data (güncellenmiş)
import { FileTextIcon, Shield, LayoutDashboard, Users, Warehouse, Package, ShieldCheck, Route, Pyramid, Briefcase, Layers, Construction, Building2, MapPin, Tag } from 'lucide-react';

export const NavMainData = [
  {
    to: '/',
    label: 'Anasayfa',
    icon: LayoutDashboard,
  },

  {
    to: '/malzeme',
    label: 'Malzeme Yönetimi',
    icon: Package,
  },
  {
    to: '/malzeme-hareketleri',
    label: 'Malzeme Hareketleri',
    icon: Route,
  },

  {
    to: '/tutanak',
    label: 'Tutanak',
    icon: FileTextIcon,
  },

  {
    label: 'Personel Yönetimi',
    icon: Building2,
    isDropdown: true,
    children: [
      {
        to: '/personel',
        label: 'Personel Listesi',
        icon: Users,
      },
      {
        to: '/personel/roller',
        label: 'Roller ve Yetkiler',
        icon: ShieldCheck,
      },
      {
        to: '/personel/departmanlar',
        label: 'Departmanlar',
        icon: Briefcase,
      },
    ],
  },

  {
    label: 'Tanımlamalar',
    icon: Layers,
    isDropdown: true,
    children: [
      {
        to: '/birim',
        label: 'Birimler',
        icon: Building2,
      },
      {
        to: '/sube',
        label: 'Şubeler',
        icon: ShieldCheck,
      },
      {
        to: '/buro',
        label: 'Bürolar',
        icon: Briefcase,
      },
      {
        to: '/sabitkodu',
        label: 'Stok Kodu',
        icon: Construction,
      },
      {
        to: '/marka',
        label: 'Marka',
        icon: Pyramid,
      },
      {
        to: '/model',
        label: 'Model',
        icon: Tag,
      },
      {
        to: '/depo',
        label: 'Depolar',
        icon: Warehouse,
      },
      {
        to: '/konum',
        label: 'Konumlar',
        icon: MapPin,
      },
    ],
  },

  {
    to: '/denetim-kaydi',
    label: 'Denetim Kaydı',
    icon: Shield,
  },
];
