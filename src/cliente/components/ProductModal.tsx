import { useState } from 'react';
import styles from '../styles/Menu.module.css';
import type { IProductClient } from '../types/IProductClient';
import type { IArticle } from '../../administracion-sistema/api/types/IArticle';

// Define las props que el modal esperará
interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: IProductClient
    onAddToCart: (product: any, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onAddToCart }) => {
    // Si el modal no está abierto o no hay producto, no renderizamos nada
    if (!isOpen || !product) {
        return null;
    }

    // Estado local para la cantidad del producto
    const [quantity, setQuantity] = useState(1);

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

    const handleAddToCartWithStockCheck = () => {
        if (product.productType === 'supply') {
            // Safe type assertion via unknown
            const supply = product as unknown as IArticle;
            const stockActual = supply.currentStock ?? 0;
            if (stockActual < quantity) {
                alert('No hay suficiente stock del insumo seleccionado para la cantidad elegida.');
                return;
            }
        } else if (!product.isPromo) {
            // Validación de platos (ya implementada)
            const faltantes = product.manufacturedArticleDetail?.filter(detail => {
                const cantidadNecesaria = detail.quantity * quantity;
                const stockActual = detail.article?.currentStock ?? 0;
                return stockActual < cantidadNecesaria;
            });
            if (faltantes && faltantes.length > 0) {
                alert(`Este plato no se encuentra disponible por falta de stock de ingredientes. Disculpe las molestias.`);
                return;
            }
        } else {
            // Validación de promos (ya implementada)
            const faltantes = product.saleDetails?.filter(detail => {
                if (detail.article) {
                    const cantidadNecesaria = detail.quantity * quantity;
                    const stockActual = detail.article.currentStock ?? 0;
                    return stockActual < cantidadNecesaria;
                }
                if (detail.manufacturedArticle && Array.isArray(detail.manufacturedArticle.manufacturedArticleDetail)) {
                    return detail.manufacturedArticle.manufacturedArticleDetail.some(ing => {
                        const cantidadNecesaria = ing.quantity * detail.quantity * quantity;
                        const stockActual = ing.article?.currentStock ?? 0;
                        return stockActual < cantidadNecesaria;
                    });
                }
                return false;
            });
            if (faltantes && faltantes.length > 0) {
                alert(`No hay suficiente stock para la promo seleccionada.`);
                return;
            }
        }
        // Si todo OK, agrega al carrito
        onAddToCart(product, quantity);
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <img src="/icons/close.svg" alt="Cerrar" />
                </button>

                <div className={styles.modalImageContainer}>
                    <img
                        src={`data:image/png;base64,${product.manufacInventoryImage.imageData}`}
                        alt={product.name}
                        className={styles.modalImage} />

                    <h3 className={styles.modalProductName}>{product.name}</h3>
                </div>

                <p className={styles.modalDescription}>{product.description}</p>
                {product.isPromo && (
                    <div>
                        <p><strong>Incluye:</strong></p>
                        <ul>
                            {/* Mostrar detalles de promoción desde saleDetails */}
                            {product.saleDetails?.map((detail, idx) => (
                                <li key={idx}>
                                    {detail.article?.denomination || detail.manufacturedArticle?.name}
                                    {detail.quantity ? ` x${detail.quantity}` : ""}
                                </li>
                            ))}
                            {/* Fallback: mostrar desde manufacturedArticleDetail si saleDetails está vacío */}
                            {(!product.saleDetails || product.saleDetails.length === 0) &&
                                product.manufacturedArticleDetail?.map((detail, idx) => (
                                    <li key={idx}>
                                        {detail.article?.denomination}
                                        {detail.quantity ? ` x${detail.quantity}` : ""}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                )}

                <p className={styles.modalIngredients}>
                    <span className={styles.ingredientsTitle}>Ingredientes:</span>{' '}
                    {product.isPromo && product.saleDetails ? (
                        // Para promociones, mostrar ingredientes de saleDetails
                        product.saleDetails
                            .map(detail => detail.article?.denomination ?? '')
                            .filter(denomination => denomination)
                            .join(', ')
                    ) : (
                        // Para productos normales, usar manufacturedArticleDetail
                        product.manufacturedArticleDetail
                            ?.map(ing => ing.article?.denomination ?? '')
                            .filter(denomination => denomination)
                            .join(', ')
                    )}
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

                <button className={styles.addToCartButton} onClick={handleAddToCartWithStockCheck}>
                    AGREGAR AL CARRITO
                </button>
            </div>
        </div>
    );
};

export default ProductModal;