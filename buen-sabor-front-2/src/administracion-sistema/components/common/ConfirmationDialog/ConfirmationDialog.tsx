// src/administracion-sistema/components/common/ConfirmationDialog/ConfirmationDialog.tsx

import React from 'react';
import { Button } from '../Button/Button'; // Importamos nuestro Button genérico
import './ConfirmationDialog.css'; // Estilos para el diálogo de confirmación

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void; // Función para cerrar el diálogo (cancelar)
    onConfirm: () => void; // Función para confirmar la acción
    title: string;
    message: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}) => {
    if (!isOpen) return null; // No renderizar si no está abierto

    return (
        <div className="confirmation-dialog-overlay">
            <div className="confirmation-dialog-content">
                <h3 className="confirmation-dialog-title">{title}</h3>
                <p className="confirmation-dialog-message">{message}</p>
                <div className="confirmation-dialog-actions">
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        Confirmar
                    </Button>
                </div>
            </div>
        </div>
    );
};