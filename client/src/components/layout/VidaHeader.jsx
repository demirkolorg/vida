import { VidaLogo } from "./VidaLogo";
import { VidaNavMenu } from "./VidaNavMenu";
import { VidaAccountMenu } from "./VidaAccountMenu";
import { RehberButton } from "../theme/RehberButton";
import { ThemeSelector } from "../theme/ThemeSelector";
import { NotificationMenu } from "../notification/NotificationMenu";
import { HeaderSearchComponent } from "@/app/globalSearch/pages/HeaderSearchComponent";

export const VidaHeader = () => {
  return (
    <header className="sticky  top-0 z-50 flex  items-center h-16  gap-4 border-b bg-primary/5 px-16 backdrop-blur-md">
      <div className=" flex">
        <VidaLogo />
      </div>

      <div className=" grow flex items-center justify-center">
        <VidaNavMenu />
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-2 lg:gap-2">
        <HeaderSearchComponent />
        <ThemeSelector />
        <RehberButton />
        <NotificationMenu />
        <VidaAccountMenu />
      </div>
    </header>
  );
};
