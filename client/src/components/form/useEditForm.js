import { useState, useCallback, useEffect } from 'react';

export function useEditForm({
    initialData,
    schema,
    createFn,
    updateFn,
    entityId,
    onSuccess,
    onError,
}) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFormData(entityId ? (initialData || {}) : {});
        setErrors({});
    }, [initialData, entityId]);

    const setFieldValue = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field] || errors._general) {
            setErrors(prev => {
                const newErrors = { ...prev };
                if (prev[field]) {
                    delete newErrors[field];
                }
                if (prev._general) {
                    delete newErrors._general;
                }
                return newErrors;
            });
        }
    }, [errors]);

    const validate = useCallback(() => {
        if (!formData || typeof formData !== 'object') {
            console.error("validate: formData is not an object", formData);
            setErrors({ _general: "Form verisi geçersiz." });
            return null;
        }

        const dataToValidateInput = { ...formData };
        if ('id' in dataToValidateInput) {
            delete dataToValidateInput.id;
        }

        const dataForValidation = Object.entries(dataToValidateInput).reduce((acc, [key, value]) => {
            acc[key] = value ?? '';
            return acc;
        }, {});

        const result = schema.safeParse(dataForValidation);

        if (!result.success) {
            const newErrors = {};
            result.error.errors.forEach((err) => {
                if (err.path.length > 0) {
                    newErrors[err.path[0]] = err.message;
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

        let resultData = null;
        try {
            if (entityId && updateFn) {
                resultData = await updateFn(entityId, validatedData);
            } else if (!entityId && createFn) {
                resultData = await createFn(validatedData);
            } else {
                throw new Error('Uygun işlem fonksiyonu (create/update) veya ID bulunamadı.');
            }
            if (resultData) {
                onSuccess?.(resultData);
            } else {
                console.warn('İşlem fonksiyonu bir sonuç döndürmedi.');
                setErrors(prev => ({ ...prev, _general: 'İşlem başarısız oldu veya API\'den veri dönmedi.' }));
            }
        } catch (error) {
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