// pages/auth/login.jsx (veya .tsx)
import { useAuthStore } from "@/stores/authStore";
import { Navigate, useLocation } from "react-router-dom";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/pages/auth/login/login-form"; // LoginForm importunuzu doğrulayın
import loginimage from "@/assets/login.jpg"; // Resim yolunuzu doğrulayın

export default function LoginPage() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const location = useLocation();
  // Login sonrası yönlendirilecek varsayılan sayfa "/" (ana sayfa)
  // Eğer ProtectedRoute'tan state ile gelinmişse o sayfa kullanılır.
  const from = location.state?.from?.pathname || "/";

  if (isAuth) {
    // Zaten giriş yapılmışsa, kullanıcıyı "from" adresine (veya ana sayfaya) yönlendir.
    return <Navigate to={from} replace />;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Van {/* Proje adınız veya logonuz */}
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm redirectTo={{ redirectTo: from }} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={loginimage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover "
        />
      </div>
    </div>
  );
}
