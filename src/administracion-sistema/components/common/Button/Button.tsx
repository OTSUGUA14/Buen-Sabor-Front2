// src/administracion-sistema/components/common/Button/Button.tsx

import React from 'react';
import './Button.css'; // Importamos los estilos del botón

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline-primary' | 'outline-danger';
    size?: 'small' | 'medium' | 'large';
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    // Puedes añadir más props si necesitas iconos, disabled, etc.
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    children,
    onClick,
    className = '', // Para permitir clases adicionales
    ...rest
}) => {
    const buttonClasses = `btn btn-${variant} btn-${size} ${className}`;

    return (
        <button className={buttonClasses} onClick={onClick} {...rest}>
            {children}
        </button>
    );
};