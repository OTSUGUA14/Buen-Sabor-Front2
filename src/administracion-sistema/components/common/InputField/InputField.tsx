// src/administracion-sistema/components/common/InputField/InputField.tsx

import './InputField.css'; 

interface InputFieldProps {
    label?: string;
    name: string; 
    type?: React.HTMLInputTypeAttribute; 
    value?: string | number; 
    defaultValue?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; 
    placeholder?: string; 
    error?: string; 
    disabled?: boolean; 
    readOnly?: boolean; 
    className?: string;
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