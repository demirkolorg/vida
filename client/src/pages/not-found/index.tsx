import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full space-y-6 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl animate-bounce">404</h1>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl ">Böyle bir sayfa bulunamadı</h1>
            <p className="text-primary/40">Bilinmeyen dijital aleme adım atmış gibi görünüyorsunuz.</p>
          </div>
          <Button className="cursor-pointer inline-flex h-10 items-center rounded-mdfocus-visible:outline-none focus-visible:ring-1  disabled:pointer-events-none disabled:opacity-50" onClick={() => navigate('/dashboard')}>
          Web sitesine geri dön
          </Button>
        </div>
      </div>

    </>
  );
};
