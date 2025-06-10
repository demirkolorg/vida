import "./index.css";
import { Toaster } from "sonner";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./routes/AppRouter.jsx";
import { ThemeProvider } from "./components/theme/theme-provider.jsx";
import { LayoutProvider } from "@/contexts/LayoutContext";
import  {SettingsProvider} from "@/components/theme/SettingsContext";


createRoot(document.getElementById("root")).render(
  <ThemeProvider storageKey="vida-theme" defaultTheme="system">
    <LayoutProvider>
          <SettingsProvider>


      <AppRouter />
          </SettingsProvider>
    </LayoutProvider>
    <Toaster position="bottom-right" richColors />
  </ThemeProvider>
);
