// components/CartModalCheckout.tsx
import React, { useState } from 'react';
import styles from '../styles/CartModal.module.css';

interface CartItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    onPayment: () => void;
}

const CartModal: React.FC<CartModalProps> = ({
    isOpen,
    onClose,
    cart,
    subtotal,
    deliveryFee,
    total,
    onPayment
}) => {
    const [deliveryMethod, setDeliveryMethod] = useState('Delivery');
    const [selectedAddress, setSelectedAddress] = useState('Casa');
    const [clarifications, setClarifications] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('MercadoPago');

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>DETALLE DEL PEDIDO</h2>

                {/* Método de entrega */}
                <div className={styles.section}>
                    <label>Método de entrega</label>
                    <select
                        value={deliveryMethod}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                    >
                        <option value="Delivery">Delivery</option>
                        <option value="Retiro en local">Retiro en local</option>
                    </select>
                </div>

                {/* Dirección de entrega (solo si es Delivery) */}
                {deliveryMethod === 'Delivery' && (
                    <div className={styles.section}>
                        <label>Dirección de entrega</label>
                        <select
                            value={selectedAddress}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                        >
                            <option value="Casa">Casa</option>
                            <option value="Trabajo">Trabajo</option>
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
                    {cart.map(item => (
                        <div key={item.id} className={styles.itemRow}>
                            <span>{item.name} x{item.quantity}</span>
                            <span>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                        </div>
                    ))}
                    <div className={styles.subtotalRow}>
                        <span>Subtotal</span>
                        <span>${subtotal.toLocaleString('es-AR')}</span>
                    </div>
                    <div className={styles.subtotalRow}>
                        <span>Delivery</span>
                        <span>${deliveryFee.toLocaleString('es-AR')}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>TOTAL</span>
                        <span>${total.toLocaleString('es-AR')}</span>
                    </div>
                </div>

                {/* Método de pago */}
                <div className={styles.section}>
                    <label>Método de pago</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="MercadoPago">MercadoPago</option>
                        <option value="Efectivo">Efectivo</option>
                    </select>
                </div>

                {/* Botones */}
                <div className={styles.buttonGroup}>
                    <button onClick={onClose} className={styles.cancelButton}>
                        CANCELAR
                    </button>
                    <button onClick={onPayment} className={styles.payButton}>
                        Pagar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartModal;
