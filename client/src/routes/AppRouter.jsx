// routes/AppRouter.jsx (güncellenmiş)
import { HomeIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { Spinner } from '@/components/general/Spinner';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NotFoundPage } from '@/pages/not-found';
import { RootLayout } from '@/layout/RootLayout';
import { AuthLayout } from '@/layout/AuthLayout';
import { DashboardPage } from '@/pages/dashboard';
import { useAuthStore } from '@/stores/authStore';

import LoginPage from '@/pages/auth/login';
import { Audit_ListPage } from '@/app/audit/pages/ListPage';
import { Birim_ListPage } from '@/app/birim/pages/ListPage';
import { Sube_ListPage } from '@/app/sube/pages/ListPage';
import { Buro_ListPage } from '@/app/buro/pages/ListPage';
import { Personel_ListPage } from '@/app/personel/pages/ListPage';
import { SabitKodu_ListPage } from '@/app/sabitKodu/pages/ListPage';
import { Marka_ListPage } from '@/app/marka/pages/ListPage';
import { Model_ListPage } from '@/app/model/pages/ListPage'; // YENİ EKLENEN
import { Depo_ListPage } from '@/app/depo/pages/ListPage';
import { Konum_ListPage } from '@/app/konum/pages/ListPage';
import { Malzeme_ListPage } from '@/app/malzeme/pages/ListPage';
import { MalzemeHareket_ListPage } from '@/app/malzemeHareket/pages/ListPage';
import { Tutanak_ListPage } from '@/app/tutanak/pages/ListPage';

import TutanakBuilder from '../pages/other/TutanakBuilder';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    handle: { breadcrumb: () => <HomeIcon className="h-4 w-4" /> },
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: '/',
                element: <DashboardPage />,
                handle: { breadcrumb: 'Dashboard' },
              },
              {
                path: '/birim',
                element: <Birim_ListPage />,
                handle: { breadcrumb: 'Birim' },
              },
              {
                path: '/sube',
                element: <Sube_ListPage />,
                handle: { breadcrumb: 'Şube' },
              },
              {
                path: '/buro',
                element: <Buro_ListPage />,
                handle: { breadcrumb: 'Büro' },
              },
              {
                path: '/personel',
                element: <Personel_ListPage />,
                handle: { breadcrumb: 'Personel' },
              },
              {
                path: '/sabitkodu',
                element: <SabitKodu_ListPage />,
                handle: { breadcrumb: 'Sabit Kodu' },
              },
              {
                path: '/marka',
                element: <Marka_ListPage />,
                handle: { breadcrumb: 'Marka' },
              },
              {
                path: '/model', // YENİ EKLENEN
                element: <Model_ListPage />,
                handle: { breadcrumb: 'Model' },
              },
              {
                path: '/depo',
                element: <Depo_ListPage />,
                handle: { breadcrumb: 'Depo' },
              },
              {
                path: '/depo',
                element: <Depo_ListPage />,
                handle: { breadcrumb: 'Depo' },
              },
              {
                path: '/konum',
                element: <Konum_ListPage />,
                handle: { breadcrumb: 'Konum' },
              },
              {
                path: '/malzeme',
                element: <Malzeme_ListPage />,
                handle: { breadcrumb: 'Malzeme' },
              },
              {
                path: '/malzeme-hareketleri',
                element: <MalzemeHareket_ListPage />,
              },
              {
                path: '/denetim-kaydi',
                element: <Audit_ListPage />,
              },
              {
                path: '/tutanak',
                element: <Tutanak_ListPage />,
              },
              {
                path: '/builder',
                element: <TutanakBuilder />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  const checkAuth = useAuthStore(state => state.checkAuth);
  const [initialCheckPerformed, setInitialCheckPerformed] = useState(false);

  useEffect(() => {
    const performInitialCheck = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('İlk kimlik kontrolü sırasında hata:', error);
      } finally {
        setInitialCheckPerformed(true);
      }
    };

    if (!initialCheckPerformed) {
      performInitialCheck();
    }
  }, [checkAuth, initialCheckPerformed]);

  if (!initialCheckPerformed) {
    return (
      <div className="flex h-full w-full h-screen items-center justify-center">
        <Spinner size="large">
          <span className="mt-2 text-sm ">Kimlik doğrulanıyor...</span>
        </Spinner>
      </div>
    );
  }

  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
