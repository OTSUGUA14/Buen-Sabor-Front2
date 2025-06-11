// src/administracion-sistema/hooks/useForm.ts

import { useState, useEffect, useCallback } from 'react';
import type { IFormFieldConfig, FormData } from '../components/crud/GenericForm/GenericForm.types';

// Hook personalizado para manejar formularios genéricos
export const useForm = <T extends Record<string, any>>(
    initialData: FormData<T> = {},
    fieldsConfig: IFormFieldConfig[]
) => {
    const [formData, setFormData] = useState<FormData<T>>(initialData);
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const defaultValues: FormData<T> = {};
        fieldsConfig.forEach(field => {
            if (initialData && initialData[field.name] !== undefined) {
                defaultValues[field.name as keyof T] = initialData[field.name as keyof T];
            } else if (field.defaultValue !== undefined) {
                defaultValues[field.name as keyof T] = field.defaultValue;
            } else {
                defaultValues[field.name as keyof T] = undefined;
            }
        });

        const isDifferent = Object.keys(defaultValues).some(
            key => formData[key] !== defaultValues[key]
        );
        if (isDifferent) {
            setFormData({ ...defaultValues });
        }
    }, [JSON.stringify(initialData), JSON.stringify(fieldsConfig)]);

    const validateField = useCallback((name: string, value: any): string | undefined => {
        const fieldConfig = fieldsConfig.find(f => f.name === name);
        if (!fieldConfig || !fieldConfig.validation) {
            return undefined; // No hay reglas de validación
        }

        const { validation } = fieldConfig;

        // Validación 'required'
        if (validation.required && (value === null || value === undefined || (typeof value === 'string' && value.trim() === ''))) {
            return `${fieldConfig.label} es obligatorio.`;
        }

        // Validaciones específicas por tipo
        if (value !== null && value !== undefined && typeof value === 'string' && value.trim() !== '') {
            if (validation.minLength && value.length < validation.minLength) {
                return `${fieldConfig.label} debe tener al menos ${validation.minLength} caracteres.`;
            }
            if (validation.maxLength && value.length > validation.maxLength) {
                return `${fieldConfig.label} no debe exceder los ${validation.maxLength} caracteres.`;
            }
            if (validation.pattern && !validation.pattern.test(value)) {
                return `${fieldConfig.label} no tiene un formato válido.`;
            }
        }

        if (typeof value === 'number') {
            if (validation.min !== undefined && value < validation.min) {
                return `${fieldConfig.label} debe ser al menos ${validation.min}.`;
            }
            if (validation.max !== undefined && value > validation.max) {
                return `${fieldConfig.label} no debe exceder ${validation.max}.`;
            }
        }

        // Validación personalizada
        if (validation.custom) {
            return validation.custom(value);
        }

        return undefined; // No hay errores
    }, [fieldsConfig]);

    // Función para validar todo el formulario
    const validateForm = useCallback(() => {
        let newErrors: Record<string, string | undefined> = {};
        let isValid = true;
        fieldsConfig.forEach(field => {
            const error = validateField(field.name, formData[field.name as keyof T]);
            if (error) {
                newErrors[field.name] = error;
                isValid = false;
            }
        });
        setErrors(newErrors);
        return isValid;
    }, [formData, fieldsConfig, validateField]);

    // Manejador de cambio para los inputs
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let newValue: any = value;

        // Conversión de tipo para números
        if (type === 'number') {
            newValue = value === '' ? undefined : Number(value); // undefined si está vacío, para evitar NaN en inputs vacíos
        }
        // Conversión para checkbox
        if (type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        }

        setFormData(prevData => ({
            ...prevData,
            [name]: newValue,
        }));

        // Validar el campo inmediatamente
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: validateField(name, newValue),
        }));
    }, [validateField]);


    // Manejador de envío del formulario
    const handleSubmit = useCallback(async (
        event: React.FormEvent,
        onSubmitCallback: (data: FormData<T>) => Promise<void> | void
    ) => {
        event.preventDefault();
        setIsSubmitting(true);

        const isValid = validateForm();

        if (isValid) {
            try {
                await onSubmitCallback(formData);
            } catch (err) {
                console.error('Error al enviar el formulario:', err);
                // Aquí podrías establecer un error global del formulario si lo necesitas
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setIsSubmitting(false); // Si la validación falla, no estamos enviando
            console.log('Formulario inválido, por favor revisa los errores.');
        }
    }, [formData, validateForm]);


    return {
        formData,
        setFormData, // Para casos donde necesites establecer el formulario directamente
        errors,
        handleChange,
        handleSubmit,
        isSubmitting,
        validateForm, // Exponer para validación externa si se necesita
        validateField // Exponer para validación externa de un campo específico
    };
};