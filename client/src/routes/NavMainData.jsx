import { LayoutDashboard, Users, Package, ShieldCheck, Route } from 'lucide-react';

export const NavMainData = [
  {
    to: '/',
    label: 'Anasayfa',
    icon: LayoutDashboard,
  },
  {
    to: '/personeller',
    label: 'Personeller',
    icon: Users,
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
    to: '/birim',
    label: 'Birim',
    icon: ShieldCheck,
  },
];
