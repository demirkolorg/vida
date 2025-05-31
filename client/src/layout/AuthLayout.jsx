// src/components/SiteLayout.tsx
import { Outlet } from 'react-router-dom'; // react-router-dom'dan importlar
import { VidaHeader } from '@/components/layout/VidaHeader'; // VidaHeader bileşeni
import { VidaFooter } from '@/components/layout/VidaFooter'; // VidaFooter bileşeni

export function AuthLayout() {

  return (
    <div className="flex min-h-screen w-full flex-col">
      <VidaHeader />
      <main className="flex flex-1 flex-row px-16 pt-8  ">
        <Outlet />
      </main>
      {/* <VidaFooter/> */}
    </div>
  );
}
