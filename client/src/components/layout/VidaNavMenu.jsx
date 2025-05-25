import { NavLink, useLocation } from 'react-router-dom'; // useLocation import edildi
import { NavMainData } from '@/routes/NavMainData';
import { LayoutDashboard, Users, Package, ShieldCheck, Route, Settings, FileText, Briefcase, Layers, Building } from 'lucide-react'; // Örnek ikonlar
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'; // Shadcn UI DropdownMenu
import { ChevronDown } from 'lucide-react'; // Dropdown ikonu için

const iconMap = {
  LayoutDashboard,
  Users,
  Package,
  ShieldCheck,
  Route,
  Settings,
  FileText,
  Layers,
  Briefcase,
  Building,
};

export const VidaNavMenu = () => {
  const location = useLocation();

  const isParentOrChildActive = item => {
    return item.isDropdown
      ? item.children.some(child => location.pathname.startsWith(child.to)) || (item.to && location.pathname.startsWith(item.to))
      : location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to + '/'));
  };

  return (
    <nav key="vida-nav-main" className="flex flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-2 md:text-sm lg:gap-4 p-4 ">
      {NavMainData.map((item, index) => {
        const IconComponent = typeof item.icon === 'string' ? iconMap[item.icon] : item.icon;
        const uniqueKey = item.to || item.label || `nav-item-${index}`; // Daha güvenli bir key oluşturma

        if (item.isDropdown && item.children && item.children.length > 0) {
          return (
            <DropdownMenu key={uniqueKey}>
              <DropdownMenuTrigger className={`cursor-pointer flex items-center px-3 py-2 rounded-md font-medium transition-colors ${isParentOrChildActive(item) ? 'bg-primary/20' : 'hover:bg-primary/10'}`}>
                {IconComponent && <IconComponent className="mr-2 h-5 w-5" />}
                {item.label}
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {item.children.map((child, childIndex) => {
                  const ChildIconComponent = child.icon;
                  const childUniqueKey = child.to || child.label || `child-nav-${childIndex}`;
                  return (
                    <DropdownMenuItem key={childUniqueKey} asChild>
                      <NavLink
                        to={child.to}
                        end={child.to === '/' || !child.to.substring(1).includes('/')}
                        className={({ isActive }) => `
                        flex items-center px-3 py-2 rounded-md font-medium transition-colors
                        ${isActive ? 'bg-primary/20' : 'hover:bg-primary/10'}
                      `}
                      >
                        {child.icon && <ChildIconComponent className="mr-2 h-5 w-5" />}
                        {child.label}
                      </NavLink>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        } else {
          return (
            <NavLink
              key={uniqueKey}
              to={item.to}
              end={item.to === '/' || !item.to.substring(1).includes('/')} // Basit bir end kontrolü
              className={({ isActive }) => {
                return `
                flex items-center px-3 py-2 rounded-md  font-medium transition-colors
                ${isActive ? 'bg-primary/20 ' : 'hover:bg-primary/10'}
              `;
              }}
            >
              {IconComponent && <IconComponent className="mr-2 h-5 w-5" />}
              {item.label}
            </NavLink>
          );
        }
      })}
    </nav>
  );
};
