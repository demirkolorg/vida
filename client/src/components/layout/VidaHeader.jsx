// src/components/SiteLayout.tsx
import { Link, NavLink } from "react-router-dom"; // react-router-dom'dan importlar
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Package2, Server } from "lucide-react";
import { LogoutDropdownMenuItem } from "@/components/auth/LogoutDropdownMenuItem";
import { VidaNavMenu } from "./VidaNavMenu";
import { VidaLogo } from "./VidaLogo";
import { ThemeSelector } from "../theme/ThemeSelector";
import { NotificationMenu } from "../notification/NotificationMenu";
import { useAuthStore } from "@/stores/authStore";
import { currentDb } from "../../api/database";
import { useEffect, useState } from "react";
import { HeaderSearchComponent } from "@/app/globalSearch/pages/HeaderSearchComponent";
import { RehberButton } from "../theme/RehberButton";
import { getDomainName, useDomainInfo } from "@/utils/domainUtil";

export const VidaHeader = () => {
  const user = useAuthStore((state) => state.user);
  const [dbName, setDbbName] = useState("");
  const viteAvatarUrl = import.meta.env.VITE_AVATAR_URL;
  const avatarUrl = viteAvatarUrl + user?.sicil;

  console.log("VITE_AVATAR_URL:", avatarUrl);


  const domainInfo = useDomainInfo();
  const currentDomain = getDomainName();
  console.log("domainInfo:", domainInfo);
  console.log("currentDomain:", currentDomain);

  useEffect(() => {
    const dbname = currentDb();
    setDbbName(dbname);
  }, []);

  return (
    <header className="sticky  top-0 z-50 flex  items-center h-16  gap-4 border-b bg-primary/5 px-16 backdrop-blur-md">
      <div className=" flex">
        <VidaLogo />

        <Badge variant="outline" className="relative rounded-md h-6 ml-2">
          <Server />
          {dbName}
          {" db"}
        </Badge>
      </div>
      <div className=" grow flex items-center justify-center">
        <VidaNavMenu />
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-2 lg:gap-2">
        <HeaderSearchComponent />

        <ThemeSelector />

        <RehberButton />

        <NotificationMenu />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full ">
              <Avatar className="h-10 w-10 border-2 border-primary/50 bg-primary/50 hover:bg-primary/70">
                <AvatarImage src={avatarUrl + user.sicil} alt={user.ad} />
                <AvatarFallback>{user.ad}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Kullanıcı menüsünü aç</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user.ad} {user.soyad}
              <span className="text-xs text-muted-foreground font-medium ml-2">
                {user.sicil}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ayarlar</DropdownMenuItem>
            <DropdownMenuItem>Destek</DropdownMenuItem>
            <DropdownMenuSeparator />
            <LogoutDropdownMenuItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Navigasyon menüsünü aç/kapat</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Şirket Adı</span>
            </Link>
            <NavLink to="/dashboard" className="hover:text-foreground">
              Kontrol Paneli
            </NavLink>
            <NavLink
              to="/orders"
              className="text-muted-foreground hover:text-foreground"
            >
              Siparişler
            </NavLink>
            <NavLink
              to="/products"
              className="text-muted-foreground hover:text-foreground"
            >
              Ürünler
            </NavLink>
            <NavLink
              to="/customers"
              className="text-muted-foreground hover:text-foreground"
            >
              Müşteriler
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};
