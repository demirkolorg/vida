// client/src/app/globalSearch/components/EmptyState.jsx
import React from 'react';
import { Search, BookOpen, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const EmptyState = ({ enableContextMenu = false }) => {
  const searchTips = [
    "Malzeme için vida numarası veya açıklama arayın",
    "Personel için ad, soyad veya sicil numarası kullanın",
    "Birim ve şube adlarında arama yapabilirsiniz",
    "En az 2 karakter girdiğinizde arama başlar"
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
      <Search className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Tüm kayıtlarda arama yapın</h3>
        <p className="text-sm text-muted-foreground">
          Yazmaya başlayın ve sistem genelindeki tüm kayıtlarda arama yapın
        </p>
      </div>
      
      {enableContextMenu && (
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="text-xs text-primary font-medium mb-1">
            💡 İpucu
          </div>
          <div className="text-xs text-muted-foreground">
            Arama sonuçlarında sağ tıklayarak işlem menüsüne erişebilirsiniz
          </div>
        </div>
      )}

      <div className="space-y-2 w-full max-w-sm">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <BookOpen className="h-3 w-3" />
          <span>Arama ipuçları:</span>
        </div>
        <div className="space-y-1">
          {searchTips.map((tip, index) => (
            <div key={index} className="text-xs text-muted-foreground text-left">
              • {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};