// src/administracion-sistema/components/common/Button/Button.tsx

import './styles/Button.css'; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline-primary' | 'outline-danger' | 'outline-info' | 'actions';
    size?: 'small' | 'medium' | 'large';
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    children,
    onClick,
    className = '', 
    ...rest
}) => {
    const buttonClasses = `btn btn-${variant} btn-${size} ${className}`;

    return (
        <button className={buttonClasses} onClick={onClick} {...rest}>
            {children}
        </button>
    );
};