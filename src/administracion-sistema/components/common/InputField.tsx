import './styles/InputField.css';

interface Option {
    value: string | number;
    label: string;
}

interface InputFieldProps {
    label?: string;
    name: string;
    type?: React.HTMLInputTypeAttribute | 'select';
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    onBlur?: (
        e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    readOnly?: boolean;
    className?: string;
    options?: Option[]; 
    step?: string; 
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
    options, // 🆕
    step, // Add this parameter
}) => {
    return (
        <div className={`input-field-container ${className || ''}`}>
            {label && <label htmlFor={name}>{label}</label>}

            {type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={error ? 'input-error' : ''}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options &&
                        options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                </select>
            ) : (
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
                    step={step}
                />
            )}

            {error && <span className="error-message">{error}</span>}
        </div>
    );
};
