// src/administracion-sistema/components/crud/GenericForm/GenericForm.types.ts

// ISelectOption puede estar en otro archivo o aquí, asegúrate de que exista
export interface ISelectOption {
    value: string | number;
    label: string;
}

export interface IFormFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'password' | 'date' | 'select' | 'textarea' | 'search' | 'checkbox' | 'array';
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        pattern?: RegExp;
        custom?: (value: any) => string | undefined;
    };
    options?: ISelectOption[];
    placeholder?: string;
    className?: string;
    readOnly?: boolean;
    transformInitialValue?: (value: any) => any;

    // Esto es clave para los campos tipo 'array':
    fields?: IFormFieldConfig[];
}

// Definición de FormData, típicamente Partial<T> es suficiente
export type FormData<T> = Partial<T>;

// Si necesitas una definición más compleja para casos donde los campos pueden ser strings o el tipo original
// export type FormData<T> = {
//   [K in keyof T]?: T[K] extends Array<infer U> ? string | U[] : T[K] extends object ? FormData<T[K]> : T[K] | string;
// };