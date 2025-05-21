import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { NavLink } from 'react-router-dom';
import { NavMainData } from '@/routes/NavMainData';

export const VidaNavMenu = () => {
  return (
    <nav className="flex-col  gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {NavMainData.map(item => {
            const IconComponent = item.icon;
            return (
              <NavigationMenuItem key={item.to}>
                <NavigationMenuLink asChild>
                  <NavLink
                    to={item.to}
                   className={navigationMenuTriggerStyle}
                  >
                    <span className="flex items-center">
                      {IconComponent && <IconComponent className="mr-2 h-5! w-5!" />}
                      {item.label != null && item.label}
                    </span>
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
