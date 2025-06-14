
import { Button } from './Button';
import './styles/ConfirmationDialog.css'; 

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void; 
    onConfirm: () => void; 
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