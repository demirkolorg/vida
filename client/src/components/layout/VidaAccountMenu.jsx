import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogoutDropdownMenuItem } from "@/components/auth/LogoutDropdownMenuItem";
import { useAuthStore } from "@/stores/authStore";
import logoimage from "@/assets/logo/vida.png"; // Resim yolunuzu doğrulayın
import { useState, useEffect } from "react";

export const VidaAccountMenu = () => {
  const user = useAuthStore((state) => state.user);
  const viteAvatarUrl = import.meta.env.VITE_AVATAR_URL;
  const avatarUrl = viteAvatarUrl + user?.sicil;
  const [imgSrc, setImgSrc] = useState(logoimage); // Başlangıçta logo ile başla
  const [hasTriedOriginal, setHasTriedOriginal] = useState(false);

  // avatarUrl değiştiğinde imgSrc'yi güncelle
  useEffect(() => {
    if (avatarUrl && user?.sicil) {
      setImgSrc(avatarUrl);
      setHasTriedOriginal(false);
    } else {
      setImgSrc(logoimage);
    }
  }, [avatarUrl, user?.sicil]);

  const handleImageError = () => {
    if (!hasTriedOriginal) {
      setHasTriedOriginal(true);
      setImgSrc(logoimage);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full ">
          <Avatar className="h-10 w-10 border-2 border-primary/50 bg-primary/50 hover:bg-primary/70">
            <AvatarImage
              src={imgSrc}
              alt={user?.ad || "User"}
              onError={handleImageError}
            />
            <AvatarFallback>{user?.ad || "U"}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Kullanıcı menüsünü aç</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user?.ad} {user?.soyad}
          <span className="text-xs text-muted-foreground font-medium ml-2">
            {user?.sicil}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Ayarlar</DropdownMenuItem>
        <DropdownMenuItem>Destek</DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutDropdownMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};