// VidaNavMenu.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavMainData } from '@/routes/NavMainData';
import { Home, Users, Package, Truck, Briefcase } from 'lucide-react'; // Örnek ikonlar
import { Button } from "@/components/ui/button";

// İkonları bir map'e alabiliriz (NavMainData'daki icon string'lerine göre)
const iconMap = {
  Home,
  Users,
  Package,
  Truck,
  Briefcase,
  // Diğer ikonlarınızı buraya ekleyin
};

export const VidaNavMenu = () => {
  return (
    <nav className="flex flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-2 md:text-sm lg:gap-4 p-4 ">
      {' '}
      {/* Arkaplan ekledim ki görelim */}
      {NavMainData.map(item => {
        // NavMainData'daki item.icon bir string ise ve iconMap'te karşılığı varsa
        const IconComponent = typeof item.icon === 'string' ? iconMap[item.icon] : item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            // end prop'unu kontrol etmeyi unutmayın
            end={item.to === '/' || !item.to.substring(1).includes('/')} // Basit bir end kontrolü
            className={({ isActive }) => {
              console.log(`[Simple NavLink] Path: ${item.to}, isActive: ${isActive}`); // LOG
              return `
                flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors
                ${isActive && 'bg-primary/30 '}
              `;
            }}
          >
            {IconComponent && <IconComponent className="mr-2 h-5 w-5" />}
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
};
