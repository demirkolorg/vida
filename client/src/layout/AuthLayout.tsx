import {  SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <SidebarProvider>
      <Outlet />
    </SidebarProvider>
  );
};
