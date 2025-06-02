// client/src/app/malzeme/components/BulkZimmetDialog.jsx
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { 
  Check, 
  ChevronsUpDown, 
  Package, 
  Users, 
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

// Store imports
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store';
import { Personel_Store } from '@/app/personel/constants/store';
import { MalzemeKondisyonuEnum, malzemeKondisyonuOptions } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { cn } from '@/lib/utils';

// Form schema
const bulkZimmetSchema = z.object({
  hedefPersonelId: z.string({
    required_error: 'Lütfen bir personel seçin.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    required_error: 'Lütfen malzeme kondisyonunu seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
});

const BulkZimmetDialog = ({ isOpen, onClose, selectedMalzemeler = [] }) => {
  const [personelPopoverOpen, setPersonelPopoverOpen] = useState(false);
  const [kondisyonPopoverOpen, setKondisyonPopoverOpen] = useState(false);

  // Store states
  const bulkZimmet = MalzemeHareket_Store(state => state.bulkZimmet);
  const loadingAction = MalzemeHareket_Store(state => state.loadingAction);
  const personelList = Personel_Store(state => state.datas) || [];
  const loadPersonelList = Personel_Store(state => state.GetAll);

  const form = useForm({
    resolver: zodResolver(bulkZimmetSchema),
    defaultValues: {
      malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
      aciklama: '',
      hedefPersonelId: undefined,
    },
  });

  // Personel listesini yükle
  useEffect(() => {
    if (isOpen && personelList.length === 0) {
      loadPersonelList({ page: 1, pageSize: 1000, filter: {} });
    }
  }, [isOpen, personelList.length, loadPersonelList]);

  // Dialog açıldığında formu sıfırla
  useEffect(() => {
    if (isOpen) {
      form.reset({
        malzemeKondisyonu: MalzemeKondisyonuEnum.Saglam,
        aciklama: '',
        hedefPersonelId: undefined,
      });
    } else {
      setPersonelPopoverOpen(false);
      setKondisyonPopoverOpen(false);
    }
  }, [isOpen, form]);

  const onSubmit = async (data) => {
    try {
      const bulkData = {
        hedefPersonelId: data.hedefPersonelId,
        malzemeKondisyonu: data.malzemeKondisyonu,
        aciklama: data.aciklama || undefined,
        malzemeler: selectedMalzemeler.map(malzeme => ({
          malzemeId: malzeme.id
        }))
      };

      await bulkZimmet(bulkData, { showToast: true });
      onClose();
    } catch (error) {
      console.error('Bulk zimmet hatası:', error);
    }
  };

  // Uygun malzemeleri filtrele (sadece depodakiler)
  const uygunMalzemeler = selectedMalzemeler.filter(malzeme => {
    const sonHareket = malzeme.malzemeHareketleri?.[0];
    return sonHareket && ['Kayit', 'Iade', 'DepoTransferi'].includes(sonHareket.hareketTuru);
  });

  const uygunOlmayanMalzemeler = selectedMalzemeler.filter(malzeme => {
    const sonHareket = malzeme.malzemeHareketleri?.[0];
    return !sonHareket || !['Kayit', 'Iade', 'DepoTransferi'].includes(sonHareket.hareketTuru);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Toplu Zimmet İşlemi
          </DialogTitle>
          <DialogDescription>
            Seçili malzemeleri toplu olarak personele zimmetleyin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Malzeme Özeti */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Seçili Malzemeler</h4>
              <Badge variant="secondary">
                {selectedMalzemeler.length} malzeme
              </Badge>
            </div>

            {/* Uygun Malzemeler */}
            {uygunMalzemeler.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs">
                    {uygunMalzemeler.length} Zimmet Edilebilir
                  </Badge>
                </div>
                <ScrollArea className="h-24 border rounded p-2">
                  <div className="space-y-1">
                    {uygunMalzemeler.map(malzeme => (
                      <div key={malzeme.id} className="flex items-center gap-2 text-sm">
                        <Package className="h-3 w-3 text-green-600" />
                        <span className="font-mono text-xs">
                          {malzeme.vidaNo || malzeme.id}
                        </span>
                        <span className="text-muted-foreground">
                          {malzeme.sabitKodu?.ad} - {malzeme.marka?.ad}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Uygun Olmayan Malzemeler */}
            {uygunOlmayanMalzemeler.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <Badge variant="warning" className="text-xs">
                    {uygunOlmayanMalzemeler.length} Zimmet Edilemez
                  </Badge>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded p-3">
                  <ScrollArea className="h-20">
                    <div className="space-y-1">
                      {uygunOlmayanMalzemeler.map(malzeme => {
                        const sonHareket = malzeme.malzemeHareketleri?.[0];
                        return (
                          <div key={malzeme.id} className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                            <span className="font-mono text-xs">
                              {malzeme.vidaNo || malzeme.id}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {sonHareket ? 
                                `Son durumu: ${sonHareket.hareketTuru}` : 
                                'Hareket geçmişi yok'
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                  <p className="text-xs text-amber-700 mt-2">
                    Bu malzemeler personelde veya kayıp/düşüm durumunda olduğu için zimmetlenemez.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Form */}
          {uygunMalzemeler.length > 0 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Hedef Personel */}
                <FormField
                  control={form.control}
                  name="hedefPersonelId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Zimmet Edilecek Personel*</FormLabel>
                      <Popover open={personelPopoverOpen} onOpenChange={setPersonelPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button 
                              variant="outline" 
                              role="combobox" 
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? personelList.find(p => p.id === field.value)?.adSoyad ||
                                  personelList.find(p => p.id === field.value)?.ad ||
                                  'Personel Bulunamadı'
                                : 'Personel seçin...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command
                            filter={(value, search) => {
                              const personel = personelList.find(p => p.id === value);
                              const personelAdi = personel?.adSoyad || personel?.ad || '';
                              const sicil = personel?.sicil || '';
                              return (personelAdi + ' ' + sicil).toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
                            }}
                          >
                            <CommandInput placeholder="Personel ara..." />
                            <CommandList>
                              <CommandEmpty>Personel bulunamadı.</CommandEmpty>
                              <CommandGroup>
                                {personelList.map(personel => (
                                  <CommandItem
                                    value={personel.id}
                                    key={personel.id}
                                    onSelect={() => {
                                      form.setValue('hedefPersonelId', personel.id);
                                      setPersonelPopoverOpen(false);
                                    }}
                                  >
                                    <Check 
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        personel.id === field.value ? 'opacity-100' : 'opacity-0'
                                      )} 
                                    />
                                    <div className="flex flex-col">
                                      <span>{personel.adSoyad || personel.ad}</span>
                                      {personel.sicil && (
                                        <span className="text-xs text-muted-foreground">
                                          Sicil: {personel.sicil}
                                        </span>
                                      )}
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Malzeme Kondisyonu */}
                <FormField
                  control={form.control}
                  name="malzemeKondisyonu"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Malzeme Kondisyonu*</FormLabel>
                      <Popover open={kondisyonPopoverOpen} onOpenChange={setKondisyonPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button 
                              variant="outline" 
                              role="combobox" 
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value 
                                ? malzemeKondisyonuOptions.find(k => k.value === field.value)?.label 
                                : 'Kondisyon seçin...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Kondisyon ara..." />
                            <CommandList>
                              <CommandEmpty>Kondisyon bulunamadı.</CommandEmpty>
                              <CommandGroup>
                                {malzemeKondisyonuOptions.map(kondisyon => (
                                  <CommandItem
                                    value={kondisyon.value}
                                    key={kondisyon.value}
                                    onSelect={() => {
                                      form.setValue('malzemeKondisyonu', kondisyon.value);
                                      setKondisyonPopoverOpen(false);
                                    }}
                                  >
                                    <Check 
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        kondisyon.value === field.value ? 'opacity-100' : 'opacity-0'
                                      )} 
                                    />
                                    {kondisyon.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Açıklama */}
                <FormField
                  control={form.control}
                  name="aciklama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Toplu zimmet ile ilgili ek bilgiler (isteğe bağlı)..." 
                          className="resize-none" 
                          rows={3} 
                          {...field} 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    İptal
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loadingAction || form.formState.isSubmitting}
                  >
                    {loadingAction || form.formState.isSubmitting ? 
                      'İşleniyor...' : 
                      `${uygunMalzemeler.length} Malzemeyi Zimmetle`
                    }
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {/* Hiç uygun malzeme yoksa */}
          {uygunMalzemeler.length === 0 && (
            <div className="text-center py-6">
              <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Zimmet Edilebilir Malzeme Yok</h3>
              <p className="text-muted-foreground mb-4">
                Seçili malzemelerin hiçbiri zimmet işlemi için uygun değil.
              </p>
              <Button variant="outline" onClick={onClose}>
                Kapat
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkZimmetDialog;