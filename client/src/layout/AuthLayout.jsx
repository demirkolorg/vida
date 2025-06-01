// src/components/SiteLayout.tsx
import { Outlet } from 'react-router-dom'; // react-router-dom'dan importlar
import { VidaHeader } from '@/components/layout/VidaHeader'; // VidaHeader bileşeni
import { useLayout } from '@/contexts/LayoutContext';
import { cn } from '@/lib/utils';

export function AuthLayout() {
  const { disablePadding } = useLayout();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <VidaHeader />
      <main className={cn('flex flex-1 flex-row pt-8 transition-all duration-300', disablePadding ? 'px-4' : 'px-16')}>
        <Outlet />
      </main>
    </div>
  );
}
