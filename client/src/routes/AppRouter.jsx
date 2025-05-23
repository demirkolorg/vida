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
import { BirimListPage } from '@/app/birim/pages/ListPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // RootLayout <Outlet /> ve <Toaster /> içerir
    errorElement: <NotFoundPage />,
    handle: { breadcrumb: () => <HomeIcon className="h-4 w-4" /> }, // Ana sayfa breadcrumb'ı
    children: [
      {
        // 1. Giriş sayfası için ayrı bir yol (korumasız)
        path: 'login',
        element: <LoginPage />,
      },
      {
        // 2. Koruma altındaki tüm yollar için bir sarmalayıcı
        element: <ProtectedRoute />, // Bu bileşen giriş yapılmamışsa /login'e yönlendirir
        children: [
          // {
          //   // 3. Ana sayfa ("/") artık burası ve ProtectedRoute altında
          //   index: true, // path: "/" ile aynı anlama gelir (parent'ı "/" olduğu için)
          //   element: <HomePage />,
          //   // handle: { breadcrumb: "Ana Sayfa" }, // Gerekirse HomePage için breadcrumb
          // },
          {
            // 4. AuthLayout kullanan diğer korumalı yollar (örneğin /dashboard)
            element: <AuthLayout />, // Kenar çubuğu, başlık vb. içeren layout
            children: [
              {
                path: '/', // "/dashboard" olarak çözümlenir
                element: <DashboardPage />,
                handle: { breadcrumb: 'Dashboard' },
              },
              {
                path: '/birim', // "/dashboard" olarak çözümlenir
                element: <BirimListPage />,
                handle: { breadcrumb: 'Birim' },
              },
              // ... AuthLayout kullanan diğer korumalı sayfalarınız
            ],
          },
          // ... AuthLayout KULLANMAYAN ama korumalı olan başka sayfalarınız varsa buraya eklenebilir
        ],
      },
      // ... Diğer herkese açık yollarınız (varsa)
    ],
  },
]);

export function AppRouter() {
  const checkAuth = useAuthStore(state => state.checkAuth);
  const [initialCheckPerformed, setInitialCheckPerformed] = useState(false);

  useEffect(() => {
    const performInitialCheck = async () => {
      try {
        await checkAuth(); // checkAuth'un tamamlanmasını bekle
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
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="large">
          <span className="mt-2 text-sm text-muted-foreground">Kimlik doğrulanıyor...</span>
        </Spinner>
      </div>
    );
  }

  // İlk kontrol tamamlandıysa, RouterProvider'ı render et
  // Bu noktada checkAuth işlemi bitmiş ve isAuth state'i güncellenmiş olmalı.
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
