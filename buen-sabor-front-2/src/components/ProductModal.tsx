import React from 'react';
import styles from '../styles/Menu.module.css';

// Define las props que el modal esperará
interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        name: string;
        description: string;
        ingredients: string;
        price: number;
        image: string;
    } | null; // Puede ser null si no hay producto seleccionado
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
    // Si el modal no está abierto o no hay producto, no renderizamos nada
    if (!isOpen || !product) {
        return null;
    }

    // Estado local para la cantidad del producto
    const [quantity, setQuantity] = React.useState(1);

    const handleDecreaseQuantity = () => {
        setQuantity(prev => Math.max(1, prev - 1)); // Mínimo 1
    };

    const handleIncreaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    // Función para manejar el clic en el overlay (fondo oscuro)
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <img src="/icons/close.svg" alt="Cerrar" />
                </button>

                <div className={styles.modalImageContainer}>
                    <img src={product.image} alt={product.name} className={styles.modalImage} />
                    <h3 className={styles.modalProductName}>{product.name}</h3>
                </div>

                <p className={styles.modalDescription}>{product.description}</p>
                <p className={styles.modalIngredients}>
                    <span className={styles.ingredientsTitle}>Ingredientes:</span> {product.ingredients}
                </p>

                <div className={styles.modalPriceSection}>
                    <span className={styles.modalPriceLabel}>Precio:</span>
                    <span className={styles.modalPrice}>${product.price.toLocaleString('es-AR')}</span>
                </div>

                <div className={styles.quantityControl}>
                    <span className={styles.quantityLabel}>CANTIDAD</span>
                    <div className={styles.quantityButtons}>
                        <button className={styles.quantityButton} onClick={handleDecreaseQuantity}>-</button>
                        <span className={styles.currentQuantity}>{quantity}</span>
                        <button className={styles.quantityButton} onClick={handleIncreaseQuantity}>+</button>
                    </div>
                </div>

                <button className={styles.addToCartButton}>
                    AGREGAR AL CARRITO
                </button>
            </div>
        </div>
    );
};

export default ProductModal;