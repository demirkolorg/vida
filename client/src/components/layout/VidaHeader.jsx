// src/components/SiteLayout.tsx
import { Link, NavLink, Outlet } from "react-router-dom"; // react-router-dom'dan importlar
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Menu, Package2, Search } from "lucide-react";
import { ThemeToggleButton } from "@/components/theme/theme-toggle-button";
import { LogoutDropdownMenuItem } from "@/components/auth/LogoutDropdownMenuItem";
import { VidaNavMenu } from "./VidaNavMenu";
import { VidaLogo } from "./VidaLogo";

export const VidaHeader = () => {
  return (
    <header className="sticky  top-0 z-50 flex  items-center h-16  gap-4 border-b bg-background px-4 md:px-6">
      <div className=" flex-none">
        <VidaLogo />
      </div>
      <div className=" grow flex items-center justify-center">
        <VidaNavMenu />
      </div>

      <div className="ml-auto flex items-center gap-4 md:gap-2 lg:gap-4">
        {/* <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Ara..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form> */}
        
        <ThemeToggleButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full cursor-pointer">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="sr-only">Kullanıcı menüsünü aç</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
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
