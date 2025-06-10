// src/administracion-sistema/components/common/InputField/InputField.tsx

import React from 'react';
import './InputField.css'; // Crearemos este archivo CSS

interface InputFieldProps {
    label?: string; // Etiqueta del campo
    name: string; // Nombre del campo (para el formulario)
    type?: React.HTMLInputTypeAttribute; // Tipo de input (text, number, email, password, etc.)
    value?: string | number; // Valor actual del campo
    defaultValue?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Manejador de cambio
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Manejador de blur
    placeholder?: string; // Texto de marcador de posición
    error?: string; // Mensaje de error a mostrar
    disabled?: boolean; // Si el campo está deshabilitado
    readOnly?: boolean; // Si el campo es solo de lectura
    className?: string; // Clases CSS adicionales
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    disabled,
    readOnly,
    className,
}) => {
    return (
        <div className={`input-field-container ${className || ''}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                className={error ? 'input-error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};