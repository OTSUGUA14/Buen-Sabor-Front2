import { useState, useEffect } from 'react';
import styles from '../styles/Menu.module.css';
import ProductModal from '../components/ProductModal';
import CartModal from '../components/CartModal';

import { getProductsAll } from '../../administracion-sistema/utils/Api';
import Menu from '../components/Menu';
import type { IProductClient } from '../types/IProductClient';
import { PayMethod, type OrderRequestDTO, type UserPreferenceRequest } from '../types/IOrderData';
import { createOrder, createPreferenceMP } from '../services/Api';
import { supplyApi } from '../../administracion-sistema/api/supply';
import { saleApi } from '../../administracion-sistema/api/sale'; // Importa la API de promociones

export default function MenuPages() {
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [productosAll, setProductosAll] = useState<IProductClient[]>([]);
    const [isProductModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // Extraer clientId desde localStorage
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const clientId = profile.id ?? null; // null si no existe

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
        try {
            const savedCart = localStorage.getItem('cart');
            const parsed = savedCart ? JSON.parse(savedCart) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = 800;
    const total = subtotal + deliveryFee;


    // Guarda el carrito en localStorage cada vez que cambie
    useEffect(() => {
    localStorage.removeItem('cart');
    const fetchProductos = async () => {
        const platos = await getProductsAll();

        // Insumos para venta
        const allSupplies = await supplyApi.getAll();
        const suppliesForSale = allSupplies
            .filter(s => s.forSale)
            .map(s => ({
                id: `supply-${s.idarticle}`,
                idmanufacturedArticle: `supply-${s.idarticle}`,
                name: s.denomination,
                price: s.buyingPrice,
                category: s.category,
                isAvailable: true,
                manufacInventoryImage: s.inventoryImage
                    ? { imageData: s.inventoryImage.imageData }
                    : { imageData: "" },
                isSupply: true,
                description: "",
                estimatedTimeMinutes: 0,
                manufacturedArticleDetail: [],
            }));

        // Promociones
        const allPromos = await saleApi.getAll();
        const promosForMenu = allPromos.map(promo => ({
            id: `promo-${promo.idsale}`,
            idmanufacturedArticle: `promo-${promo.idsale}`,
            name: promo.denomination,
            price: promo.salePrice,
            category: { name: "Promociones", idcategory: 999, forSale: true }, // Categoría especial
            isAvailable: true,
            manufacInventoryImage: promo.inventoryImage
                ? { imageData: promo.inventoryImage.imageData }
                : { imageData: "" },
            isPromo: true,
            description: promo.saleDescription,
            estimatedTimeMinutes: 0,
            manufacturedArticleDetail: promo.saleDetails, // Puedes adaptar esto si necesitas
        }));

        setProductosAll([...platos, ...suppliesForSale, ...promosForMenu]);
    };
    fetchProductos();

    const minimalCart = cart.map(item => ({
        idmanufacturedArticle: item.idmanufacturedArticle, // <-- aquí el id del producto
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));
    const cartString = JSON.stringify(minimalCart);

    if (minimalCart.length > 0) {
        if (cartString.length < 5000000) {
            localStorage.setItem('cart', cartString);
        } else {
            alert("El carrito es demasiado grande para guardar.");
        }
    }
}, [cart]);
    // Guarda el carrito solo si tiene productos, si no lo elimina

    const handleAddToCart = (product: IProductClient, quantity: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.idmanufacturedArticle === product.idmanufacturedArticle);
            if (existingItem) {
                return prevCart.map(item =>
                    item.idmanufacturedArticle === product.idmanufacturedArticle
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
        console.log(cart);
        setCart(prevCart =>

            prevCart.map(item =>
                item.idmanufacturedArticle === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const handlePayment = async (orderData: OrderRequestDTO | any, payMethod: PayMethod) => {
        console.log(orderData);
    
        const response = await createOrder(orderData as OrderRequestDTO);
    

        if (payMethod === PayMethod.MERCADOPAGO) {
            const preferenceItems: UserPreferenceRequest[] = orderData.orderDetails.map((item: any) => ({
                title: item.name,
                quantity: item.quantity,
                price: item.subTotal.toFixed(2),
            }));
    
            const preference = await createPreferenceMP(preferenceItems);

            if (preference?.init_point) {
                window.location.href = preference.init_point;
            } else {
                console.error("Missing init_point from preference:", preference);
            }
              
        }
    
        handleCloseModal();
        setIsCartModalOpen(false);
        setCart([]);
        localStorage.removeItem('cart');
    };
    const handleDecrement = (productId: number) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item =>
                item.idmanufacturedArticle
                    === productId
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
                                            onClick={() => handleDecrement(item.idmanufacturedArticle
                                            )}
                                            className={styles.decrementButton}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncrement(item.idmanufacturedArticle
                                            )}
                                            className={styles.incrementButton}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span>{item.quantity} x ${item.price.toLocaleString('es-AR')}</span>
                                    <span>Subtotal: ${(item.quantity * item.price).toLocaleString('es-AR')}</span>
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
                            Ir a pagar
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
                subsidiaryId={1}
                clientId={clientId}
                onPayment={handlePayment}

            />

        </main>
    );
}