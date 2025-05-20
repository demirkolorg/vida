
import { useAuthStore } from '@/stores/authStore';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function ProtectedRoute() {
  const isAuth = useAuthStore((state) => state.isAuth);
  // AppRouter'daki useEffect sayesinde, bu bileşen render olduğunda
  // initialCheckLoading'in false ve isAuth'un doğru set edilmiş olması beklenir.
  const location = useLocation();

  if (!isAuth) {
    // Kullanıcıyı login sayfasına yönlendir.
    // state ile kullanıcının gitmek istediği sayfayı sakla, login sonrası oraya dönebilir.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // Giriş yapılmışsa, çocuk route'ları render et.
}