// components/CartModalCheckout.tsx
import { useState } from 'react';
import styles from '../styles/CartModal.module.css';
import type { OrderRequestDTO, OrderDetailDTO, UserPreferenceRequest } from '../types/IOrderData';
import { PayMethod, OrderState, OrderType } from '../types/IOrderData';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: any[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    subsidiaryId: number;
    clientId: number;
    onPayment: (orderData: OrderRequestDTO, payMethod: PayMethod, userPreference?: UserPreferenceRequest[]) => void;
    onPayMercadoPago?: () => void; // ← Nuevo parámetro opcional
}

export const CartModal: React.FC<CartModalProps> = ({
    isOpen,
    onClose,
    cart,
    subtotal,
    deliveryFee,
    total,
    clientId,
    subsidiaryId,
    onPayment

}) => {
    const [deliveryMethod, setDeliveryMethod] = useState('DELIVERY');
    const [selectedAddress, setSelectedAddress] = useState('Casa');
    const [clarifications, setClarifications] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PayMethod>(PayMethod.MERCADOPAGO);

    if (!isOpen) return null;

    const calculatedTotal = deliveryMethod === 'Delivery' ? subtotal + deliveryFee : subtotal;
   

    // Construir detalles del pedido para OrderRequestDTO
    const orderDetails: OrderDetailDTO[] = cart.map(item => ({
        manufacturedArticleId: item.idmanufacturedArticle,
        quantity: item.quantity,
        subTotal: item.price * item.quantity
    }));

    // Construir preferencia para MercadoPago
    const userPreference: UserPreferenceRequest[] = cart.map(item => ({
        title: item.name,
        quantity: item.quantity,
        price: item.price.toString()
    }));
    const today = new Date();
    const orderDate = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
    // Enviar datos al backend según método de pago
    const handlePayment = () => {
        const order: OrderRequestDTO = {
            estimatedFinishTime: "10:00:00",
            total: calculatedTotal,
            totalCost: subtotal,
            orderState: OrderState.PENDING,
            // Cambiar para que agarre ordertype
            orderType: deliveryMethod as OrderType,
            payMethod: paymentMethod,
            orderDate: orderDate,
            takeAway: deliveryMethod !== 'DELIVERY',
            clientId,
            direction:selectedAddress,
            subsidiaryId,
            orderDetails
        };

        if (paymentMethod === PayMethod.MERCADOPAGO) {
            onPayment(order, PayMethod.MERCADOPAGO, userPreference); // 👈 envío adicional
        } else {
            onPayment(order, PayMethod.CASH);
        }

    };

    console.log(deliveryMethod);
    
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>DETALLE DEL PEDIDO</h2>

                {/* Método de entrega */}
                <div className={styles.section}>
                    <label>Método de entrega</label>
                    <select
                        value={deliveryMethod}
                        onChange={(e) => setDeliveryMethod(e.target.value as OrderType)}
                    >
                        <option value={OrderType.DELIVERY}>Delivery</option>
                        <option value={OrderType.TAKEAWAY}>Retiro en local</option>
                        <option value={OrderType.ON_SITE}>En el local</option>
                    </select>
                </div>

                {/* Dirección de entrega (solo si es Delivery) */}
                {deliveryMethod === 'DELIVERY' && (
                    <div className={styles.section}>
                        <label>Dirección de entrega</label>
                        <select
                            value={selectedAddress}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                        >
                            {/* Cargar direcciones desde localStorage */}
                            {(() => {
                                const profile = JSON.parse(localStorage.getItem('profile') || '{}');
                                const domiciles = profile.domiciles ?? [];
                                if (domiciles.length === 0) {
                                    return <option value="">No hay direcciones registradas</option>;
                                }
                                return domiciles.map((dom: any) => (
                                    <option key={dom.iddomicile} value={dom.iddomicile}>
                                        {dom.street} {dom.number}, {dom.location?.name}, {dom.location?.province?.name}
                                    </option>
                                ));
                            })()}
                        </select>
                    </div>
                )}

                {/* Aclaraciones */}
                <div className={styles.section}>
                    <label>Aclaraciones</label>
                    <input
                        type="text"
                        placeholder="Agregar aclaraciones"
                        value={clarifications}
                        onChange={(e) => setClarifications(e.target.value)}
                    />
                </div>

                <hr className={styles.separator} />

                {/* Resumen de la orden */}
                <div className={styles.orderSummary}>
                    <h3>Su orden</h3>
                    {cart.map((item, index) => (
                        <div key={`${item.id}-${index}`} className={styles.itemRow}>
                            <span>{item.name} x{item.quantity}</span>
                            <span>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                        </div>
                    ))}

                    <div className={styles.subtotalRow}>
                        <span>Subtotal</span>
                        <span>${subtotal.toLocaleString('es-AR')}</span>
                    </div>

                    {/* costo delivery (solo si es Delivery) */}
                    {deliveryMethod === 'Delivery' && (
                        <div className={styles.subtotalRow}>
                            <span>Delivery</span>
                            <span>${deliveryFee.toLocaleString('es-AR')}</span>
                        </div>
                    )}

                    <div className={styles.totalRow}>
                        <span>TOTAL</span>
                        <span>${calculatedTotal.toLocaleString('es-AR')}</span>
                    </div>
                </div>

                {/* Método de pago */}
                <div className={styles.section}>
                    <label>Método de pago</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PayMethod)}
                    >
                        <option value={PayMethod.MERCADOPAGO}>MercadoPago</option>
                        <option value={PayMethod.CASH}>Efectivo</option>
                    </select>
                </div>

                {/* Botones */}
                <div className={styles.buttonGroup}>
                    <button onClick={onClose} className={styles.cancelButton}>
                        CANCELAR
                    </button>
                    <button onClick={handlePayment} className={styles.payButton}>
                        {paymentMethod === PayMethod.CASH ? 'Reservar' : 'Pagar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartModal;
