// src/components/dialogs/CopyToClipboardDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // DialogClose'u import etmeyi unutmayın
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

export function CopyToClipboardDialog({ isOpen, onClose, rowData, columns }) {
  const [selectedColumnId, setSelectedColumnId] = useState('');
  const [valueToCopy, setValueToCopy] = useState('');

  useEffect(() => {
    // Dialog açıldığında veya sütunlar değiştiğinde ilk sütunu seçili yap (eğer varsa)
    if (isOpen && columns && columns.length > 0) {
      if (!selectedColumnId || !columns.find(c => c.id === selectedColumnId)) {
        setSelectedColumnId(columns[0].id);
      }
    } else if (!isOpen) {
        setSelectedColumnId(''); // Dialog kapandığında seçimi sıfırla
        setValueToCopy('');
    }
  }, [isOpen, columns, selectedColumnId]);

  useEffect(() => {
    // Seçili sütun veya satır verisi değiştiğinde kopyalanacak değeri güncelle
    if (rowData && selectedColumnId) {
      // `rowData` `row.original` objesidir.
      // `selectedColumnId` ise sütunun ID'sidir.
      // Eğer accessorFn varsa, onu kullanarak değeri almak daha doğru olurdu,
      // ama burada sadece `row.original`'a erişimimiz var.
      // TanStack Table'da `row.getValue(columnId)` bu işi yapar.
      // Şimdilik doğrudan erişimle yapalım:
      const rawValue = rowData[selectedColumnId];

      // Değeri string'e çevir (nesne veya dizi ise JSON.stringify)
      if (typeof rawValue === 'object' && rawValue !== null) {
        try {
          setValueToCopy(JSON.stringify(rawValue, null, 2));
        } catch (e) {
          setValueToCopy(String(rawValue));
        }
      } else {
        setValueToCopy(String(rawValue ?? '')); // null veya undefined ise boş string
      }
    } else {
      setValueToCopy('');
    }
  }, [rowData, selectedColumnId]);

  const handleCopyToClipboard = async () => {
    if (!valueToCopy) {
      toast.error("Kopyalanacak bir değer bulunamadı.");
      return;
    }
    try {
      await navigator.clipboard.writeText(valueToCopy);
      toast.success("Değer panoya kopyalandı!");
      onClose(); // Kopyalamadan sonra dialoğu kapat
    } catch (err) {
      console.error('Panoya kopyalanamadı:', err);
      toast.error("Değer panoya kopyalanamadı.");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hücre Değerini Kopyala</DialogTitle>
          <DialogDescription>
            Kopyalamak istediğiniz sütunu seçin. Seçilen değer aşağıdaki alanda gösterilecektir.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="column-select" className="text-right col-span-1">
              Sütun
            </Label>
            <Select
              value={selectedColumnId}
              onValueChange={setSelectedColumnId}
            >
              <SelectTrigger id="column-select" className="col-span-3">
                <SelectValue placeholder="Bir sütun seçin" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.label} ({col.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="value-to-copy" className="text-right col-span-1 pt-2">
              Değer
            </Label>
            <Input
              id="value-to-copy"
              value={valueToCopy}
              readOnly
              className="col-span-3"
              // type="textarea" olsaydı Textarea kullanılırdı, ama Input da scrollable olabilir.
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">İptal</Button>
          </DialogClose>
          <Button type="button" onClick={handleCopyToClipboard} disabled={!valueToCopy}>
            <CopyIcon className="mr-2 h-4 w-4" />
            Kopyala
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}