// src/components/SiteLayout.tsx
import { Outlet } from 'react-router-dom'; // react-router-dom'dan importlar
import { VidaHeader } from '@/components/layout/VidaHeader'; // VidaHeader bileşeni
import { VidaFooter } from '@/components/layout/VidaFooter'; // VidaFooter bileşeni

export function AuthLayout() { // children prop'u kaldırıldı
  return (
    <div className="flex min-h-screen w-full flex-col">
      <VidaHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 md:flex-row">
        <Outlet />
      </main>
     {/* <VidaFooter /> */}
    </div>
  );
}
