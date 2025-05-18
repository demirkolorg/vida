import { HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { Spinner } from "@/components/general/Spinner";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NotFoundPage } from "@/pages/not-found";
import { HomePage } from "@/pages/home";
import { RootLayout } from "@/layout/RootLayout";
import { AuthLayout } from "@/layout/AuthLayout";
import { DashboardPage } from "@/pages/dashboard";
import { useAuthStore } from "@/stores/authStore";
import LoginPage from "@/pages/auth/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    handle: { breadcrumb: () => <HomeIcon className="h-4 w-4" /> },
    children: [
      { index: true, element: <LoginPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: "/dashboard",
                element: <DashboardPage />,
                handle: { breadcrumb: "Dashboard" },
              },
            ],
          },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [initialCheckPerformed, setInitialCheckPerformed] = useState(false);

  useEffect(() => {
    const performInitialCheck = async () => {
      try {
        await checkAuth(); // checkAuth'un tamamlanmasını bekle
      } catch (error) {
        console.error("İlk kimlik kontrolü sırasında hata:", error);
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
          <span className="mt-2 text-sm text-muted-foreground">
            Kimlik doğrulanıyor...
          </span>
        </Spinner>
      </div>
    );
  }

  // İlk kontrol tamamlandıysa, RouterProvider'ı render et
  // Bu noktada checkAuth işlemi bitmiş ve isAuth state'i güncellenmiş olmalı.
  return <RouterProvider router={router} />;
}
