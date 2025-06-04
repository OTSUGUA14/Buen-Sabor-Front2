import { useState, useEffect } from 'react';
import styles from '../styles/Menu.module.css';
import ProductModal from '../components/ProductModal';
import CartModal from '../components/CartModal';

export default function Menu() {
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

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

    const hamburguesas = [
        {
            id: 1,
            name: "CLÁSICA DE LA CASA",
            description: "Una hamburguesa clásica con carne super jugosa y sabor incomparable.",
            ingredients: "pan de papa, doble carne jugosa, queso cheddar, lechuga, tomate, pepino, salsa de la casa",
            price: 5600,
            image: "https://images.rappi.cl/products/2091982356-1621649860361.png"
        },
        {
            id: 2,
            name: "BACON Y HUEVO",
            description: "La perfecta combinación de carne, bacon crocante y huevo frito.",
            ingredients: "pan brioche, carne de res, bacon, huevo, queso, cebolla caramelizada, salsa BBQ",
            price: 12000,
            image: "/productos/hamburguesa2.png"
        },
        {
            id: 3,
            name: "CEBOLLA Y BACON",
            description: "Sabor intenso con cebolla caramelizada y crujiente bacon.",
            ingredients: "pan de masa madre, carne, cebolla caramelizada, bacon, queso, pepinillos, aderezo",
            price: 9700,
            image: "/productos/hamburguesa3.png"
        },
        {
            id: 4,
            name: "POLLO CRISPY SIMPLE",
            description: "Pechuga de pollo crocante con un toque fresco.",
            ingredients: "pan de brioche, pollo frito, lechuga, tomate, mayonesa casera",
            price: 8000,
            image: "/productos/hamburguesa4.png"
        },
        {
            id: 5,
            name: "POLLO CEBOLLA Y BACON",
            description: "Variante de pollo con cebolla y bacon.",
            ingredients: "pan rústico, pollo a la plancha, cebolla morada, bacon, queso provolone, rúcula, alioli",
            price: 9500,
            image: "/productos/hamburguesa5.png"
        },
        {
            id: 6,
            name: "VEGANA SIMPLE",
            description: "Una opción saludable y deliciosa para todos.",
            ingredients: "pan integral, medallón de lentejas, espinaca, tomate, aguacate, aderezo de tahini",
            price: 8400,
            image: "/productos/hamburguesa6.png"
        },
    ];

    const pizzas = [
        {
            id: 7,
            name: "MUZZARELLA",
            description: "La clásica pizza de muzzarella con base de tomate y orégano.",
            ingredients: "masa de pizza, salsa de tomate, mozzarella, orégano, aceite de oliva",
            price: 6000,
            image: "/productos/pizza1.png"
        }
    ];

    return (
        <main className={styles.menuContainer}>
            {/* Categorías */}
            <aside className={styles.sidebar}>
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
            </aside>

            {/* Sección principal */}
            <section className={styles.mainSection}>
                {/* Buscador */}
                <div className={styles.searchBarContainer}>
                    <input type="text" placeholder="Buscar Plato" className={styles.searchInput} />
                    <img src="/icons/search.svg" alt="Buscar" className={styles.searchIcon} />
                </div>

                {/* Productos */}
                <div className={styles.productSection}>
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
                    </div>

                    <h2>PIZZAS</h2>
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
            </section>

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
                            {cart.map(item => (
                                <li key={item.id} className={styles.cartItem}>
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