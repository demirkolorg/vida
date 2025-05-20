import { ZodSchema, ZodTypeDef } from 'zod';
import { useState, useCallback, useEffect } from 'react';

type UseEditFormProps<
  TData extends { id: string },
  TUpdatePayload,
  TCreatePayload
> = {
  initialData?: TData | Partial<TData> | null;
  schema: ZodSchema<TUpdatePayload | TCreatePayload, ZodTypeDef, any>;
  createFn?: (data: TCreatePayload) => Promise<TData | null | undefined>;
  updateFn?: (id: string, data: TUpdatePayload) => Promise<TData | null | undefined>;
  entityId?: string;
  onSuccess?: (resultData: TData) => void;
  onError?: (error: any) => void;
};

// Export the FormErrors type so it can be imported elsewhere
export type FormErrors<TPayload> = Partial<Record<keyof TPayload, string>> & {
  _general?: string;
};

export function useEditForm<
  TData extends { id: string },
  TUpdatePayload extends Omit<Partial<TData>, 'id'>,
  TCreatePayload extends Omit<Partial<TData>, 'id'>
>({
  initialData,
  schema,
  createFn,
  updateFn,
  entityId,
  onSuccess,
  onError,
}: UseEditFormProps<TData, TUpdatePayload, TCreatePayload>) {
  // --- State Tanımlamaları ---
  const [formData, setFormData] = useState<Partial<TData>>({});
  // Use the exported FormErrors type here
  const [errors, setErrors] = useState<FormErrors<TUpdatePayload & TCreatePayload>>({});
  const [isLoading, setIsLoading] = useState(false);

  // --- Formu Başlatan/Sıfırlayan useEffect ---
  useEffect(() => {
    setFormData(entityId ? (initialData || {}) : {});
    setErrors({});
  }, [initialData, entityId]);

  // --- Alan Değerini Ayarlama ---
  const setFieldValue = useCallback((field: keyof (TUpdatePayload | TCreatePayload), value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field] || errors._general) {
      setErrors(prev => {
        const newErrors = { ...prev };
        // Spesifik alan hatasını sil (varsa)
        if (prev[field]) {
          delete newErrors[field];
        }
        // Genel hatayı sil (varsa)
        if (prev._general) {
          delete newErrors._general;
        }
        return newErrors;
      });
    }
  }, [errors]);


  const validate = useCallback((): TUpdatePayload | TCreatePayload | null => {

    if (!formData || typeof formData !== 'object') {
      console.error("validate: formData is not an object", formData);
      setErrors({ _general: "Form verisi geçersiz." });
      return null;
    }


    const dataToValidateInput = { ...formData }; // Önce kopyala
    if ('id' in dataToValidateInput) {
      delete dataToValidateInput.id;
    }

    const dataForValidation = Object.entries(dataToValidateInput).reduce((acc, [key, value]) => {
      acc[key as keyof (TUpdatePayload | TCreatePayload)] = value ?? '';
      return acc;
    }, {} as (TUpdatePayload | TCreatePayload));

    const result = schema.safeParse(dataForValidation);

    if (!result.success) {
      // Use the exported FormErrors type here
      const newErrors: FormErrors<TUpdatePayload & TCreatePayload> = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          newErrors[err.path[0] as keyof (TUpdatePayload & TCreatePayload)] = err.message;
        }
      });
      setErrors(newErrors);
      return null;
    }
    setErrors({});
    return result.data;
  }, [formData, schema]);

  const submit = useCallback(async () => {
    const validatedData = validate();
    if (!validatedData) {
      console.log("Validation failed or returned null.");
      return;
    }
    setIsLoading(true);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors._general;
      return newErrors;
    });

    let resultData: TData | null | undefined = null;
    try {
      if (entityId && updateFn) {
        resultData = await updateFn(entityId, validatedData as TUpdatePayload);
      } else if (!entityId && createFn) {
        resultData = await createFn(validatedData as TCreatePayload);
      } else {
        throw new Error('Uygun işlem fonksiyonu (create/update) veya ID bulunamadı.');
      }
      if (resultData) {
        onSuccess?.(resultData as TData);
      } else {
        console.warn('İşlem fonksiyonu bir sonuç döndürmedi.');
        setErrors(prev => ({ ...prev, _general: 'İşlem başarısız oldu veya API\'den veri dönmedi.' }));
      }

    } catch (error: any) {
      console.error('Form submit sırasında hata:', error);
      onError?.(error);
      setErrors(prev => ({ ...prev, _general: error.message || 'Bilinmeyen bir sunucu hatası oluştu.' }));
    } finally {
      setIsLoading(false);
    }
  }, [
    entityId,
    validate,
    updateFn,
    createFn,
    onSuccess,
    onError,
  ]);

  const manualResetForm = useCallback(() => {
    setFormData(entityId ? (initialData || {}) : {});
    setErrors({});
    setIsLoading(false);
  }, [initialData, entityId]);

  return {
    formData,
    errors,
    isLoading,
    setFieldValue,
    submit,
    resetForm: manualResetForm,
  };
}