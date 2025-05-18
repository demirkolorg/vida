import { BookOpen, Bot, Fan,EggFried, LayoutDashboard, Settings2, SquareTerminal,LucideAirVent ,Map,MapPin} from 'lucide-react';

export const NavMainData = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },

  {
    title: 'İller',
    url: '/il',
    icon: Map,
    items: [
      { title: 'Tablo', url: '/iltablo' },
      { title: 'Harita', url: '/ilharita' },
    ],
  },
  {
    title: 'İlçeler',
    url: '/ilce',
    icon: MapPin,
    items: [
      { title: 'Tablo', url: '/ilcetablo' },
      { title: 'Harita', url: '/ilceharita' },
    ],
  },
  {
    title: 'Mülki İdare Amirleri',
    url: '/mia',
    icon: SquareTerminal,
    items: [
      { title: 'Tablo', url: '/mialist' },
      { title: 'Harita', url: '/miamaps' },
      { title: 'Güncelle', url: '/miaupdate' },
    ],
  },
  {
    title: 'Valilikler',
    url: '/valilik',
    icon: Bot,
    items: [
      { title: 'Listele', url: '/valiliklist' },
      { title: 'Karşılaştır', url: '/valilikcompare' },
      { title: 'Güncelle', url: '/valilikupdate' },
    ],
  },
  {
    title: 'Kaymakamlıklar',
    url: '/kaymakamlik',
    icon: BookOpen,
    items: [
      { title: 'Listele', url: '/kaymakamliklist' },
      { title: 'Karşılaştır', url: '/kaymakamlikcompare' },
      { title: 'Güncelle', url: '/kaymakamlikupdate' },
    ],
  },
  {
    title: 'Belediye Başkanları',
    url: '/mip',
    icon: LucideAirVent,
    items: [
      { title: 'Listele', url: '/miplist' },
      { title: 'Karşılaştır', url: '/mipcompare' },
      { title: 'Güncelle', url: '/mipupdate' },
    ],
  },
  {
    title: 'Belediyeler',
    url: '/belediye',
    icon: Settings2,
    items: [
      { title: 'Listele', url: '/belediyelist' },
      { title: 'Karşılaştır', url: '/belediyecompare' },
      { title: 'Güncelle', url: '/belediyeupdate' },
    ],
  },
 
];
