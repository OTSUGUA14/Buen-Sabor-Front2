import { useState, useEffect } from 'react';
import styles from '../styles/Menu.module.css';
import ProductModal from '../components/ProductModal';
import CartModal from '../components/CartModal';

import { getProductsAll } from '../../administracion-sistema/utils/Api';
import Menu from '../components/Menu';
import type { IProductClient } from '../types/IProductClient';
import { PayMethod, type OrderDetailDTO, type OrderRequestDTO, type UserPreferenceRequest } from '../types/IOrderData';
import { createOrder, createPreferenceMP } from '../services/Api';
import { supplyApi } from '../../administracion-sistema/api/supply';
import { saleApi } from '../../administracion-sistema/api/sale'; 

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
    // Puedes definir un tipo para los items del carrito
    type CartItem = IProductClient & { quantity: number } | { 
        idmanufacturedArticle: number;
        name: string;
        price: number;
        quantity: number;
        productType: 'promo';
        saleDetails: any[];
        isPromo: true;
    };

    // Cambia el tipo del carrito
    const [cart, setCart] = useState<CartItem[]>(() => {
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

    useEffect(() => {
        console.log("🛒 Estado del carrito cambió:", cart);
    }, [cart]);

    // Guarda el carrito en localStorage cada vez que cambie
    useEffect(() => {
        const fetchProductos = async () => {
            const platos = await getProductsAll();
            const platosWithType = platos.map(plato => ({
                ...plato,
                productType: 'manufactured' as const
            }));

            // Insumos para venta
            const allSupplies = await supplyApi.getAll();
            const suppliesForSale = allSupplies
                .filter(s => s.forSale && s.idarticle)
                .map(s => ({
                    id: s.idarticle!,
                    idmanufacturedArticle: s.idarticle!,
                    name: s.denomination,
                    price: s.buyingPrice,
                    currentStock: s.currentStock, 
                    category: { 
                        name: s.category?.name || "Insumos",
                        idcategory: s.category?.idcategory || 0,
                        forSale: true 
                    },
                    isAvailable: true,
                    manufacInventoryImage: s.inventoryImage
                        ? { imageData: s.inventoryImage.imageData }
                        : { imageData: "" },
                    productType: 'supply' as const,
                    description: "",
                    estimatedTimeMinutes: 0,
                    manufacturedArticleDetail: [],
                }));

            // Promociones
            const allPromos = await saleApi.getAll();
            const promosForMenu = allPromos
                .filter(promo => promo.idsale)
                .map(promo => ({
                    id: promo.idsale!,
                    idmanufacturedArticle: promo.idsale!,
                    name: promo.denomination,
                    price: promo.salePrice,
                    category: { name: "Promociones", idcategory: 999, forSale: true }, // Categoría especial
                    isAvailable: true,
                    manufacInventoryImage: promo.inventoryImage
                        ? { imageData: promo.inventoryImage.imageData }
                        : { imageData: "" },
                    productType: 'promo' as const,
                    isPromo: true,
                    description: promo.saleDescription,
                    estimatedTimeMinutes: 0,
                    manufacturedArticleDetail: [], // Simplificado por ahora
                    saleDetails: promo.saleDetails || [],
                }));

            setProductosAll([...platosWithType, ...suppliesForSale, ...promosForMenu]);
        };
        fetchProductos();

        // Solo guardar el carrito si tiene items
        const minimalCart = cart.map(item => ({
            idmanufacturedArticle: item.idmanufacturedArticle,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        }));
        
        if (minimalCart.length > 0) {
            const cartString = JSON.stringify(minimalCart);
            if (cartString.length < 5000000) {
                localStorage.setItem('cart', cartString);
            } else {
                alert("El carrito es demasiado grande para guardar.");
            }
        } else {
            localStorage.removeItem('cart'); // ✅ Solo remover si está vacío
        }
    }, [cart]);
    // Guarda el carrito solo si tiene productos, si no lo elimina

    const handleAddToCart = (product: IProductClient | CartItem, quantity: number) => {
        if (product.productType === 'promo') {
            // Si ya existe la promo en el carrito, suma la cantidad
            setCart(prevCart => {
                const existingPromo = prevCart.find(item => item.productType === 'promo' && item.idmanufacturedArticle === product.idmanufacturedArticle);
                if (existingPromo && 'quantity' in existingPromo) {
                    return prevCart.map(item =>
                        item.productType === 'promo' && item.idmanufacturedArticle === product.idmanufacturedArticle
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    return [...prevCart, { ...product, quantity }];
                }
            });
        } else {
            // Producto normal
            setCart(prevCart => {
                const existingItem = prevCart.find(item => item.idmanufacturedArticle === product.idmanufacturedArticle && item.productType !== 'promo');
                if (existingItem && 'quantity' in existingItem) {
                    return prevCart.map(item =>
                        item.idmanufacturedArticle === product.idmanufacturedArticle && item.productType !== 'promo'
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    return [...prevCart, { ...product, quantity }];
                }
            });
        }
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

    const handlePayment = async (orderData: OrderRequestDTO | any, payMethod: PayMethod, userPreference?: UserPreferenceRequest[]) => {
        console.log("=== INICIO PAYMENT ===");
        console.log("orderData:", orderData);
        console.log("payMethod:", payMethod);
        console.log("userPreference:", userPreference);
        console.log("cart:", cart);

        try {
            console.log("Enviando orden...");
            await createOrder(orderData as OrderRequestDTO);
            console.log("Orden creada exitosamente");

            // ✅ Limpiar carrito INMEDIATAMENTE después de crear la orden exitosamente
            setCart([]);
            localStorage.removeItem('cart');
            setIsCartModalOpen(false);

            if (payMethod === PayMethod.MERCADOPAGO) {
                console.log("Procesando MercadoPago...");
                if (userPreference && userPreference.length > 0) {
                    console.log("Creando preferencia con:", userPreference);
                    const preference = await createPreferenceMP(userPreference);
                    console.log("Respuesta preferencia:", preference);

                    if (preference?.init_point) {
                        console.log("Redirigiendo a:", preference.init_point);
                        window.location.href = preference.init_point;
                    } else {
                        console.error("Missing init_point from preference:", preference);
                        alert("Error al crear la preferencia de MercadoPago");
                    }
                } else {
                    console.error("No hay items para MercadoPago");
                    alert("No hay items para procesar el pago");
                }
            }
            
        } catch (error) {
            console.error("Error completo:", error);
            alert("Error al procesar el pedido. Por favor intente nuevamente.");
        }
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
    const orderDetails: OrderDetailDTO[] = cart
    .filter(item => item.productType === 'manufactured' && typeof item.idmanufacturedArticle === 'number')
    .map(item => ({
        manufacturedArticleId: item.idmanufacturedArticle as number,
        quantity: item.quantity,
        subTotal: item.price * item.quantity
    }));

    const verificarStockCarrito = () => {
        // Verifica platos
        const faltantesPlatos = cart.filter(item =>
            item.productType === 'manufactured' &&
            item.manufacturedArticleDetail?.some((detail: any) => {
                const cantidadNecesaria = detail.quantity * item.quantity;
                const stockActual = detail.article?.currentStock ?? 0;
                return stockActual < cantidadNecesaria;
            })
        );
        // Verifica promos
        const faltantesPromos = cart.filter(item =>
            item.productType === 'promo' &&
            item.saleDetails?.some((detail: any) => {
                if (detail.article) {
                    const cantidadNecesaria = detail.quantity * item.quantity;
                    const stockActual = detail.article.currentStock ?? 0;
                    return stockActual < cantidadNecesaria;
                }
                if (detail.manufacturedArticle && Array.isArray(detail.manufacturedArticle.manufacturedArticleDetail)) {
                    return detail.manufacturedArticle.manufacturedArticleDetail.some((ing: any) => {
                        const cantidadNecesaria = ing.quantity * detail.quantity * item.quantity;
                        const stockActual = ing.article?.currentStock ?? 0;
                        return stockActual < cantidadNecesaria;
                    });
                }
                return false;
            })
        );
        // Verifica insumos/bebidas
        const faltantesInsumos = cart.filter(item =>
            item.productType === 'supply' &&
            typeof item.currentStock === 'number' &&
            item.currentStock < item.quantity
        );

        if (faltantesPlatos.length > 0 || faltantesPromos.length > 0 || faltantesInsumos.length > 0) {
            alert('No hay suficiente stock para uno o más productos del carrito. Por favor revise su pedido.');
            return false;
        }
        return true;
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
                                            onClick={() => {
                                                if (typeof item.idmanufacturedArticle === 'number') {
                                                    handleDecrement(item.idmanufacturedArticle);
                                                }
                                            }}
                                            className={styles.decrementButton}
                                            disabled={typeof item.idmanufacturedArticle !== 'number'}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => {
                                                if (typeof item.idmanufacturedArticle === 'number') {
                                                    handleIncrement(item.idmanufacturedArticle);
                                                }
                                            }}
                                            className={styles.incrementButton}
                                            disabled={typeof item.idmanufacturedArticle !== 'number'}
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
                            onClick={() => {
                                if (verificarStockCarrito()) {
                                    setIsCartModalOpen(true);
                            }
                        }}
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
                onPayment={handlePayment} // Ya acepta el tercer parámetro opcional
            />

        </main>
    );
}