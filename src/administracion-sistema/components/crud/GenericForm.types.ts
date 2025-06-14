export interface ISelectOption {
    value: string | number;
    label: string;
}

export interface IFormFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'password' | 'date' | 'select' | 'textarea' | 'search' | 'checkbox' | 'array'| 'file';
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
    defaultValue?: any; 
    fields?: IFormFieldConfig[];
}

export type FormData<T> = Partial<T>;
