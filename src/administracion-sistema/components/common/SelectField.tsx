
import './SelectField.css'; // Crearemos este archivo CSS

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectFieldProps {
    label?: string; // Etiqueta del campo
    name: string; // Nombre del campo (para el formulario)
    options: SelectOption[]; // Array de opciones para el select
    value?: string | number; // Valor actual seleccionado
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Manejador de cambio
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void; // Manejador de blur
    error?: string; // Mensaje de error a mostrar
    disabled?: boolean; // Si el campo está deshabilitado
    className?: string; // Clases CSS adicionales
    defaultValue?: string | number; // Valor por defecto, si no se especifica 'value'
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    name,
    options,
    value,
    onChange,
    onBlur,
    error,
    disabled,
    className,
    defaultValue,
}) => {
    return (
        <div className={`select-field-container ${className || ''}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <select
                id={name}
                name={name}
                value={value !== undefined ? value : defaultValue}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                className={error ? 'select-error' : ''}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};