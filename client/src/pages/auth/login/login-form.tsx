// src/components/LoginForm.tsx (veya benzeri bir yol)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils"; // Shadcn UI utility
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
// import { Package2 } from "lucide-react"; // Login formunda doğrudan kullanılmıyor gibi
import { useAuthStore } from '@/stores/authStore'; // authStore'unuzun doğru yolu
import { toast } from 'sonner';

// Props tipini React.ComponentProps<"form"> yerine daha spesifik yapabiliriz
// ama şimdilik bu şekilde bırakıyorum.
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [sicil, setSicil] = useState('');
  const [parola, setParola] = useState('');
  const authLogin = useAuthStore((state) => state.login); // Store'daki login fonksiyonu
  const isLoading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sicil.trim() || !parola.trim()) {
      toast.error("Sicil ve parola alanları boş bırakılamaz.");
      return;
    }

    try {
      // authStore'daki login fonksiyonu {sicil, parola} objesini bekliyor olmalı.
      // Bu fonksiyon başarılı olursa true dönecek veya hata fırlatacak.
      await authLogin({ sicil, parola });
      // Başarılı giriş mesajı store'dan veya buradan verilebilir. Store'da zaten var.
      navigate('/dashboard'); // Başarılı giriş sonrası yönlendir
    } catch (error) {
      // Hata mesajı zaten authStore'daki login fonksiyonu tarafından toast ile gösteriliyor.
      // Burada ek bir loglama yapılabilir.
      console.error("LoginForm handleSubmit error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("w-full max-w-md mx-auto flex flex-col gap-6 p-6 sm:p-8 border rounded-lg shadow-lg bg-card", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        {/* <img src="/logo.svg" alt="Vida Logo" className="h-12 w-auto mb-2" /> Vida Logosu için */}
        <h1 className="text-2xl sm:text-3xl font-bold">Vida'ya Giriş Yap</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Hesabınıza erişmek için bilgilerinizi girin.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="sicil">Sicil Numaranız</Label>
          <Input
            id="sicil"
            type="text"
            placeholder="örn: 99999"
            required
            value={sicil}
            onChange={(e) => setSicil(e.target.value)}
            disabled={isLoading}
            autoComplete="username"
          />
        </div>
        <div className="grid gap-1.5">
          <div className="flex items-center">
            <Label htmlFor="password">Parola</Label>
            <Link
              to="/parolami-unuttum" // Parolamı unuttum sayfası için bir route olmalı
              tabIndex={-1} // Klavye navigasyonunda form elemanlarından sonra gelmesi için
              className="ml-auto text-sm underline-offset-4 hover:underline text-primary"
            >
              Parolamı unuttum?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </Button>
      </div>
      <div className="text-center text-sm">
        Hesabın yok mu?{" "}
        <Link to="/kayit-ol" className="font-medium underline underline-offset-4 text-primary hover:text-primary/90">
          Kayıt ol
        </Link>
      </div>
    </form>
  );
}