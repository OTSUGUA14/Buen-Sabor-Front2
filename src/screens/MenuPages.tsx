import { useState, useEffect } from 'react';
import styles from '../styles/Menu.module.css';
import ProductModal from '../components/ProductModal';
import CartModal from '../components/CartModal';
import type { IProduct } from '../administracion-sistema/api/types/IProduct';
import { getProductsAll } from '../administracion-sistema/utils/Api';
import Menu from '../components/Menu';

export default function MenuPages() {
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [productosAll, setProductosAll] = useState<IProduct[]>([]);
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
    // Guardar carrito en localStorage cada vez que cambie
    useEffect(() => {
        const fetchProductos = async () => {
            const platos = await getProductsAll();
            setProductosAll(platos);
        };
        fetchProductos();
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

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

    const productosConCategoria = productosAll.map(producto => {
        let categoria = '';

        // Ejemplo básico: buscar por nombre
        if (producto.name.toLowerCase().includes('pizza')) {
            categoria = 'PIZZAS';
        } else if (producto.name.toLowerCase().includes('hamburguesa')) {
            categoria = 'HAMBURGUESAS';
        } else {
            categoria = 'OTROS';
        }

        return {
            ...producto,
            category: categoria
        };
    });


    return (
        <main className={styles.menuContainer}>
            {/* Categorías */}
            {/* <aside className={styles.sidebar}>
                <ul className={styles.categoryList}>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/burger.svg" alt="Hamburguesas" />
                        <button className={styles.categoryButton}>HAMBURGUESAS</button>
                    </li>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/pizza.svg" alt="Pizzas" />
                        <button className={styles.categoryButton}>PIZZAS</button>
                    </li>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/empanada.svg" alt="Empanadas" />
                        <button className={styles.categoryButton}>EMPANADAS</button>
                    </li>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/salad.svg" alt="Ensaladas" />
                        <button className={styles.categoryButton}>ENSALADAS</button>
                    </li>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/fries.svg" alt="Acompañamientos" />
                        <button className={styles.categoryButton}>ACOMPAÑAMIENTOS</button>
                    </li>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/dessert.svg" alt="Postres" />
                        <button className={styles.categoryButton}>POSTRES</button>
                    </li>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/drink.svg" alt="Bebidas" />
                        <button className={styles.categoryButton}>BEBIDAS</button>
                    </li>
                </ul>
            </aside> */}

            {/* Sección principal */}
            {/* <section className={styles.mainSection}> */}
            {/* Buscador */}
            {/* <div className={styles.searchBarContainer}>
                    <input type="text" placeholder="Buscar Plato" className={styles.searchInput} />
                    <img src="/icons/search.svg" alt="Buscar" className={styles.searchIcon} />
                </div> */}

            {/* Productos */}
            {/* <div className={styles.productSection}>
                    <h2>HAMBURGUESAS</h2>
                    <div className={styles.productGrid}>
                        {hamburguesas.map(product => (
                            <div
                                key={product.id}
                                className={styles.productCard}
                                onClick={() => handleProductClick(product)} // Agregamos el onClick aquí
                            >
                                <img src={product.image} alt={product.name} />
                                <p>{product.name}</p>
                                <span>${product.price.toLocaleString('es-AR')}</span>
                            </div>
                        ))}
                    </div> */}

            {/* <h2>PIZZAS</h2>
                    <div className={styles.productGrid}>
                        {pizzas.map(product => (
                            <div
                                key={product.id}
                                className={styles.productCard}
                                onClick={() => handleProductClick(product)}
                            >
                                <img src={product.image} alt={product.name} />
                                <p>{product.name}</p>
                                <span>${product.price.toLocaleString('es-AR')}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </section> */}

            <Menu products={productosConCategoria} onProductClick={handleProductClick} />

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