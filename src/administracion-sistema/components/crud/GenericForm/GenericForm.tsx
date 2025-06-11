// src/administracion-sistema/components/crud/GenericForm/GenericForm.tsx


import { useForm } from '../../../hooks/useForm';
import { Button } from '../../common/Button/Button';
import type { IFormFieldConfig, FormData, ISelectOption } from './GenericForm.types';
import './GenericForm.css';
import { useMemo } from 'react';

interface GenericFormProps<T extends Record<string, any>> {
    initialData?: FormData<T>;
    fieldsConfig: IFormFieldConfig[];
    onSubmit: (data: FormData<T>) => Promise<void> | void;
    submitButtonText?: string;
}

export const GenericForm = <T extends Record<string, any>>({
    initialData,
    fieldsConfig,
    onSubmit,
    submitButtonText = 'Guardar',
}: GenericFormProps<T>) => {
    // Hola chicos como estan?
    const processedInitialData = useMemo(() => {  
        if (!initialData) return undefined;

        const newInitialData = { ...initialData };
        fieldsConfig.forEach(field => {
            if (field.transformInitialValue && newInitialData[field.name as keyof T] !== undefined) {
                newInitialData[field.name as keyof T] = field.transformInitialValue(newInitialData[field.name as keyof T]);
            }
        });
        return newInitialData;
    }, [initialData, fieldsConfig]);


    const {
        formData,
        errors,
        handleChange,
        handleSubmit,
        isSubmitting,
    } = useForm<T>(processedInitialData, fieldsConfig);

    const onSubmitHandler = (e: React.FormEvent) => {
        handleSubmit(e, onSubmit);
    };

    return (
        <form className="generic-form" onSubmit={onSubmitHandler}>
            {fieldsConfig.map((field) => (
                <div className="form-group" key={field.name}>
                    <label htmlFor={field.name}>{field.label}:</label>
                    {field.type === 'textarea' ? (
                        <textarea
                            id={field.name}
                            name={field.name}
                            value={(formData[field.name as keyof T] || '') as string}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            readOnly={field.readOnly}
                            className={errors[field.name] ? 'input-error' : ''}
                            rows={4}
                        />
                    ) : field.type === 'select' ? (
                        <select
                            id={field.name}
                            name={field.name}
                            value={(formData[field.name as keyof T] || '') as string | number}
                            onChange={handleChange}
                            className={errors[field.name] ? 'input-error' : ''}
                            disabled={field.readOnly}
                        >
                            <option value="">Selecciona una opción</option>
                            {field.options?.map((option: ISelectOption) => (
                                <option key={String(option.value)} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : field.type === 'checkbox' ? (
                        <input
                            type="checkbox"
                            id={field.name}
                            name={field.name}
                            checked={(formData[field.name as keyof T] || false) as boolean}
                            onChange={handleChange}
                            disabled={field.readOnly}
                        />
                    ) : field.type === 'file' ? (
                        <input
                            type="file"
                            id={field.name}
                            name={field.name}
                            onChange={handleChange}
                            readOnly={field.readOnly}
                            className={errors[field.name] ? 'input-error' : ''}
                        />

                    ):(
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={(formData[field.name as keyof T] || '') as string | number}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            readOnly={field.readOnly}
                            className={errors[field.name] ? 'input-error' : ''}
                            {...(field.type === 'number' && {
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                            })}
                        />
                    )}
                    {errors[field.name] && <span className="error-message-field">{errors[field.name]}</span>}
                </div>
            ))}
            <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : submitButtonText}
            </Button>
        </form>
    );
};