import { useState, useEffect } from 'react';
import styles from '../styles/Menu.module.css';
import ProductModal from '../components/ProductModal';
import CartModal from '../components/CartModal';

import { getProductsAll } from '../administracion-sistema/utils/Api';
import Menu from '../components/Menu';
import type { IProductClient } from '../type/IProductClient';

export default function MenuPages() {
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [productosAll, setProductosAll] = useState<IProductClient[]>([]);
    const [isProductModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);


    const handleProductClick = (productData: any) => {
        setSelectedProduct(productData);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };



    // Inicializamos carrito desde localStorage (si existe)
    const [cart, setCart] = useState<any[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = 800;
    const total = subtotal + deliveryFee;


    // Guarda el carrito en localStorage cada vez que cambie
    useEffect(() => {
        const fetchProductos = async () => {
            const platos = await getProductsAll();
            setProductosAll(platos);
        };
        fetchProductos();
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);
    
    // Limpia el localStorage del carrito al cargar la página
    useEffect(() => {
        localStorage.removeItem('cart');
    }, []);

    const handleAddToCart = (product: any, quantity: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity }];
            }
        });
        handleCloseModal();
    };

    const handleIncrement = (productId: number) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };
    const handlePayment = () => {
        alert('¡Gracias por su compra!');
        setCart([]); // Vaciar carrito
        setIsCartModalOpen(false);
    };
    const handleDecrement = (productId: number) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ).filter(item => item.quantity > 0);
            return updatedCart;
        });
    };




    return (
        <main className={styles.menuContainer}>


            <Menu products={productosAll} onProductClick={handleProductClick} />

            {/* Carrito */}
            <aside className={styles.cartSidebar}>
                <h3>TU PEDIDO</h3>

                {cart.length === 0 ? (
                    <div className={styles.emptyCart}>
                        <img src="/icons/empty-cart.svg" alt="carrito vacío" />
                        <p>Tu carrito está vacío</p>
                    </div>
                ) : (
                    <div className={styles.cartItems}>
                        <ul>
                            {cart.map((item, index) => (
                                <li key={index} className={styles.cartItem}>
                                    <p>{item.name}</p>
                                    <div className={styles.quantityControls}>
                                        <button
                                            onClick={() => handleDecrement(item.id)}
                                            className={styles.decrementButton}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncrement(item.id)}
                                            className={styles.incrementButton}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span>{item.quantity} x ${item.price.toLocaleString('es-AR')}</span>
                                    <span>Total: ${(item.quantity * item.price).toLocaleString('es-AR')}</span>
                                </li>
                            ))}
                        </ul>
                        <hr />
                        <p className={styles.cartTotal}>
                            Total: ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString('es-AR')}
                        </p>
                        <button
                            className={styles.openCartButton}
                            onClick={() => setIsCartModalOpen(true)}
                        >
                            Ver Carrito
                        </button>

                    </div>
                )}
            </aside>

            {/* Renderiza el modal */}
            <ProductModal
                isOpen={isProductModalOpen}
                onClose={handleCloseModal}
                product={selectedProduct}
                onAddToCart={handleAddToCart}
            />
            <CartModal
                isOpen={isCartModalOpen}
                onClose={() => setIsCartModalOpen(false)}
                cart={cart}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                onPayment={handlePayment}
            />

        </main>
    );
}