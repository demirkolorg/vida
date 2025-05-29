// client/src/app/malzemeHareket/sheets/IadeSheet.jsx
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useSheetStore } from '@/stores/sheetStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Spinner } from '@/components/general/Spinner';

import { FormFieldSelect } from '@/components/form/FormFieldSelect';
import { FormFieldTextarea } from '@/components/form/FormFieldTextarea';
import { FormFieldDatePicker } from '@/components/form/FormFieldDatePicker';

import { EntityType, EntityHuman } from '../constants/api';
import { MalzemeHareket_Store as EntityStore } from '../constants/store';
import { MalzemeHareket_IadeSchema, MalzemeKondisyonuOptions } from '../constants/schema';

// Import için gerekli store'lar
import { Malzeme_Store } from '@/app/malzeme/constants/store';
import { Personel_Store } from '@/app/personel/constants/store';
import { Konum_Store } from '@/app/konum/constants/store';

export const MalzemeHareket_IadeSheet = () => {
  const { mode, entityType, isOpen, closeSheet } = useSheetStore();
  const isSheetOpen = mode === 'iade' && entityType === EntityType && isOpen;

  const iadeAction = EntityStore(state => state.IadeAl);
  const loadingAction = EntityStore(state => state.loadingAction);

  // Seçenek listelerini çek
  const malzemeList = Malzeme_Store(state => state.datas);
  const loadMalzemeList = Malzeme_Store(state => state.GetAll);
  const personelList = Personel_Store(state => state.datas);
  const loadPersonelList = Personel_Store(state => state.GetAll);
  const konumList = Konum_Store(state => state.datas);
  const loadKonumList = Konum_Store(state => state.GetAll);

  const form = useForm({
    resolver: zodResolver(MalzemeHareket_IadeSchema),
    defaultValues: {
      malzemeId: '',
      malzemeKondisyonu: 'Saglam',
      kaynakPersonelId: '',
      hedefPersonelId: '',
      konumId: '',
      aciklama: '',
      islemTarihi: '',
    },
  });

  // Seçenek listelerini yükle
  React.useEffect(() => {
    if (isSheetOpen) {
      if (!malzemeList || malzemeList.length === 0) {
        loadMalzemeList({ showToast: false });
      }
      if (!personelList || personelList.length === 0) {
        loadPersonelList({ showToast: false });
      }
      if (!konumList || konumList.length === 0) {
        loadKonumList({ showToast: false });
      }
    }
  }, [isSheetOpen, malzemeList, personelList, konumList, loadMalzemeList, loadPersonelList, loadKonumList]);

  // Sheet kapandığında formu sıfırla
  React.useEffect(() => {
    if (!isSheetOpen) {
      form.reset();
    }
  }, [isSheetOpen, form]);

  // Seçenek listelerini hazırla
  const malzemeOptions = malzemeList?.map(malzeme => ({
    value: malzeme.id,
    label: `${malzeme.vidaNo || 'Vida No Yok'} - ${malzeme.sabitKodu?.ad || 'Sabit Kod Yok'}`,
  })) || [];

  const personelOptions = personelList?.map(personel => ({
    value: personel.id,
    label: `${personel.ad} (${personel.sicil})`,
  })) || [];

  const konumOptions = konumList?.map(konum => ({
    value: konum.id,
    label: `${konum.ad} - ${konum.depo?.ad || 'Depo Yok'}`,
  })) || [];

  const handleSubmit = async (formData) => {
    try {
      const result = await iadeAction(formData);
      if (result) {
        toast.success('Malzeme iade işlemi başarıyla tamamlandı.');
        form.reset();
        closeSheet();
      }
    } catch (error) {
      console.error('İade sheet hatası:', error);
    }
  };

  const handleOpenChange = (open) => {
    if (!open) {
      closeSheet();
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Malzeme İade Al</SheetTitle>
          <SheetDescription>
            Zimmetli malzemeyi iade olarak alın ve durumunu belirtin.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="malzemeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Malzeme *</FormLabel>
                  <FormControl>
                    <FormFieldSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={malzemeOptions}
                      placeholder="İade edilecek malzemeyi seçiniz"
                      emptyMessage="Malzeme bulunamadı"
                      showRequiredStar={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="malzemeKondisyonu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İade Durumu *</FormLabel>
                  <FormControl>
                    <FormFieldSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={MalzemeKondisyonuOptions}
                      placeholder="Malzemenin iade durumunu seçiniz"
                      showRequiredStar={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kaynakPersonelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İade Eden Personel</FormLabel>
                  <FormControl>
                    <FormFieldSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={personelOptions}
                      placeholder="Malzemeyi iade eden personeli seçiniz"
                      emptyMessage="Personel bulunamadı"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hedefPersonelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İade Alan Personel</FormLabel>
                  <FormControl>
                    <FormFieldSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={personelOptions}
                      placeholder="Malzemeyi alan personeli seçiniz"
                      emptyMessage="Personel bulunamadı"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="konumId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İade Konumu</FormLabel>
                  <FormControl>
                    <FormFieldSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={konumOptions}
                      placeholder="Malzemenin teslim edileceği konumu seçiniz"
                      emptyMessage="Konum bulunamadı"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="islemTarihi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İade Tarihi</FormLabel>
                  <FormControl>
                    <FormFieldDatePicker
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date?.toISOString())}
                      placeholder="İade tarihi seçiniz (opsiyonel)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aciklama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İade Açıklaması</FormLabel>
                  <FormControl>
                    <FormFieldTextarea
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="İade nedeni veya malzeme durumu açıklaması"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={loadingAction}>
                  İptal
                </Button>
              </SheetClose>
              <Button type="submit" disabled={loadingAction}>
                {loadingAction ? (
                  <>
                    <Spinner size="small" className="mr-2" />
                    İşleniyor...
                  </>
                ) : (
                  'İade Al'
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};