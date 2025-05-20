import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Package2,
  LayoutDashboard,
  ShoppingCart,
  Box,
  Users,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { VidaLogo } from "./VidaLogo";
import { NavMainData } from "../../routes/NavMainData";

const getNavLinkClassName = ({ isActive }) =>
  `${navigationMenuTriggerStyle()} ${isActive ? "bg-accent text-accent-foreground" : ""}`;

export const VidaNavMenu = () => {
  return (
    <nav className="flex-col  gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
     

      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {NavMainData.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavigationMenuItem key={item.to}>
                <NavigationMenuLink asChild>
                  <NavLink to={item.to} className={getNavLinkClassName}>
                    {/* İkonu ve etiketi tek bir span içinde sarmala */}
                    <span className="flex items-center">
                      {" "}
                      {/* Bu span, NavLink'in tek çocuğu olur */}
                      {IconComponent && (
                        <IconComponent className="h-6 w-6 mr-2" />
                      )}
                      {/* item.label null veya undefined değilse render et */}
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
