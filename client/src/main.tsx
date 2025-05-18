import "./index.css";
import { Toaster } from "sonner";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./routes/AppRouter.jsx";
import { ThemeProvider } from "./components/theme/theme-provider.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider storageKey="vida-theme" defaultTheme="system">
    <AppRouter />
    <Toaster position="bottom-right" richColors />
  </ThemeProvider>
);
