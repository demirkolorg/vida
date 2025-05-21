// src/components/dialog/UpdateStatusDialog.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { EntityStatusOptions } from '@/constants/statusOptions'; // Durum tipleri için sabitler
export function UpdateStatusDialog({ item, entityHumanName, entityType, currentStatus, onStatusChange, isLoading, open, onOpenChange }) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isOpen, setIsOpen] = useState(false);

  const statusOptionsToRender = EntityStatusOptions;

  useEffect(() => {
    // Dialog açıldığında veya item değiştiğinde mevcut durumu ayarla
    if (item) {
      setSelectedStatus(item.status || currentStatus);
    }
  }, [item, currentStatus, open]);

  const handleSubmit = async () => {
    if (!item || !selectedStatus || selectedStatus === (item.status || currentStatus)) {
      if (onOpenChange) onOpenChange(false); // Değişiklik yoksa kapat
      return;
    }
    try {
      await onStatusChange(item.id, selectedStatus);
      if (onOpenChange) onOpenChange(false); // Başarılı olursa kapat
    } catch (error) {
      console.error(`${entityHumanName} durum güncelleme hatası:`, error);
      // Hata durumunda dialog açık kalabilir veya kapatılabilir, tercihe bağlı
    }
  };

  if (!item) return null; // Eğer item yoksa dialog'u render etme (trigger yine de görünebilir)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item.ad || entityHumanName} Durumunu Güncelle</DialogTitle>
          <DialogDescription>
            '{item.ad || `Bu ${entityHumanName.toLowerCase()}`}' için yeni bir durum seçin. Mevcut Durum: <strong>{item.status || currentStatus}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status-select" className="text-right">
              Yeni Durum
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus} disabled={isLoading}>
              <SelectTrigger id="status-select" className="col-span-3">
                <SelectValue placeholder="Durum Seçin" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(statusOptionsToRender).map(
                  statusValue =>
                    statusValue !== 'Silindi' && (
                      <SelectItem key={statusValue} value={statusValue}>
                        {statusValue} {/* Değerin kendisi aynı zamanda etiket */}
                      </SelectItem>
                    ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              if (onOpenChange) onOpenChange(false);
            }}
            disabled={isLoading}
            className="cursor-pointer"
          >
            İptal
          </Button>
          <Button className="cursor-pointer" onClick={handleSubmit} disabled={isLoading || selectedStatus === (item.status || currentStatus)}>
            {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
