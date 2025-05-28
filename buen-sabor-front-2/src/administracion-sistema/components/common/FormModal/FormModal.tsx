// src/administracion-sistema/components/common/FormModal/FormModal.tsx

import React from 'react';
import './FormModal.css'; // Estilos para el modal del formulario

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode; // El contenido del modal (aquí irá nuestro GenericForm)
}

export const FormModal: React.FC<FormModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
}) => {
    if (!isOpen) return null; // No renderizar si no está abierto

    // Evitar que los clics dentro del modal cierren el modal
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="form-modal-overlay" onClick={onClose}>
            <div className="form-modal-content" onClick={handleContentClick}>
                <div className="form-modal-header">
                    <h3 className="form-modal-title">{title}</h3>
                    <button className="form-modal-close-button" onClick={onClose}>
                        &times; {/* Una "x" para cerrar */}
                    </button>
                </div>
                <div className="form-modal-body">
                    {children} {/* Aquí se renderizará el formulario */}
                </div>
            </div>
        </div>
    );
};