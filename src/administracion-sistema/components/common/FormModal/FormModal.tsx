// src/administracion-sistema/components/common/FormModal/FormModal.tsx


import './FormModal.css'; // Estilos para el modal del formulario

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>; // Cambiado aquí
    children: React.ReactNode;
}


export const FormModal: React.FC<FormModalProps> = ({
    isOpen,
    onClose,
    title,
    onSubmit,
    children,
}) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    };


    return (
        <div className="form-modal-overlay" onClick={onClose}>
            <div className="form-modal-content" onClick={e => e.stopPropagation()}>
                <div className="form-modal-header">
                    <h3 className="form-modal-title">{title}</h3>
                    <button className="form-modal-close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="form-modal-body">
                    <form onSubmit={handleSubmit}>
                        {children}
                    </form>
                </div>
            </div>
        </div>
    );
};
