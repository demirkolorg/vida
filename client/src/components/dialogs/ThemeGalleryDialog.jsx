// src/components/dialogs/ThemeGalleryDialog.jsx (Yeni dosya)
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  // DialogFooter, // İsteğe bağlı, belki bir "Vazgeç" butonu için
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Palette, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Her tema kartı için basit bir önizleme bileşeni
const ThemePreviewCard = ({ theme, isSelected, onSelect }) => {
  // Bu önizleme çok basit. Gerçek bir UI parçasının
  // o temanın değişkenleriyle nasıl görüneceğini gösterebilirsiniz.
  // Örneğin, minik bir buton, input, kart vb.
  // Şimdilik ana rengi ve bir kontrast rengini gösterelim.
  // CSS değişkenlerini doğrudan style'a uygulamak zor olabilir,
  // bu yüzden burada temsili renkler kullanacağız veya tema sınıfını geçici olarak uygulayacağız.

  // Temsili renkler için iconColor'ı ve ona kontrast bir rengi baz alabiliriz.
  // Daha gelişmiş bir önizleme için, her tema için küçük bir SVG veya
  // CSS ile stilize edilmiş bir div grubu oluşturabilirsiniz.

  return (
  <button
  onClick={() => onSelect(theme.value)}
  className={cn(
    "relative w-full p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md overflow-hidden",
    isSelected ? "ring-2 ring-primary shadow-lg border-primary" : "hover:border-muted-foreground/50",
    "text-left" // Metinleri sola yasla
  )}
>
  <div className="mb-2 flex items-center space-x-2">
    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.iconColor }}></div>
    <span className="text-sm font-semibold text-foreground">{theme.label}</span>
  </div>
  {/* Küçük renk paleti önizlemesi */}
  <div className="flex space-x-1 h-5">
    {/* Bu renkleri temanızın CSS değişkenlerinden almanız gerekir.
        Ya da her tema için THEMES objesinde bu önizleme renklerini de tanımlayabilirsiniz.
        Örnek: { value: "violet", label: "Menekşe", iconColor: "...", previewColors: { bg: "...", primary: "...", secondary: "..." } }
    */}
    <div className="flex-1 rounded-sm" style={{ backgroundColor: theme.iconColor }}></div> {/* Primary temsili */}
    <div className="flex-1 rounded-sm bg-gray-200 dark:bg-gray-700"></div> {/* Secondary temsili */}
    <div className="flex-1 rounded-sm bg-gray-100 dark:bg-gray-800"></div> {/* Background temsili */}
  </div>

  {isSelected && (
    <div className="absolute top-1 right-1 text-primary bg-card p-0.5 rounded-full">
      <CheckCircle className="h-4 w-4" />
    </div>
  )}
</button>
  );
};


export function ThemeGalleryDialog({
  isOpen,
  onClose,
  availableThemes,
  currentTheme,
  onThemeSelect, // (themeValue: string) => void
}) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"> {/* Daha geniş bir dialog */}
        <DialogHeader>
          <DialogTitle className="text-2xl">Tema Galerisi</DialogTitle>
          <DialogDescription>
            Uygulama görünümünü kişiselleştirmek için bir tema seçin.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] sm:max-h-[70vh] p-1 -mx-1"> {/* Kaydırma alanı */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {availableThemes.map((theme) => (
              <ThemePreviewCard
                key={theme.value}
                theme={theme}
                isSelected={currentTheme === theme.value}
                onSelect={(themeValue) => {
                  onThemeSelect(themeValue);
                  onClose(); // Tema seçildikten sonra dialogu kapat
                }}
              />
            ))}
          </div>
        </ScrollArea>
        {/* Footer'a bir "Vazgeç" butonu eklenebilir. DialogClose zaten X ikonu ile kapatır. */}
        {/*
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Vazgeç</Button>
        </DialogFooter>
        */}
      </DialogContent>
    </Dialog>
  );
}