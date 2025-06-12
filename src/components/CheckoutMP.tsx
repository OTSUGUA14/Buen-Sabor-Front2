import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

import type { ProductoCarrito } from '../context/CarritoContext';
import type { PedidoDetalle } from '../models/PedidoCart';
import { createPreferenceMP } from '../servicios/Api';
import type {UserPreferenceRequest} from '../type/IOrderData';
type CheckoutMPProps = {
    montoCarrito: number;
    itemsCarrito: ProductoCarrito[];
    payMethod: string; // Debe ser 'MERCADOPAGO' para mostrar el botón
};


function CheckoutMP({ montoCarrito, itemsCarrito, payMethod }: CheckoutMPProps) {
    const [idPreference, setIdPreference] = useState<string>('');

    const getPreferenceMP = async () => {
        if (montoCarrito <= 0 || itemsCarrito.length === 0) {
            alert("Agregue al menos un producto al carrito");
            return;
        }

        // Armar detalles del pedido
        const detalles: PedidoDetalle[] = itemsCarrito.map(item => ({
            manufacturedArticleId: item.id,
            quantity: item.cantidad,
            subTotal: item.precio * item.cantidad
        }));

        const pedidoCompleto = {
            fechaPedido: new Date().toISOString().split("T")[0],
            totalPedido: montoCarrito,
            titulo: `Pedido Buen Sabor`,
            montoTotal: montoCarrito,
            detalles
        };

        try {
            await crearPedido(pedidoCompleto);
            const response = await createPreferenceMP({
                id: 0,
                titulo: pedidoCompleto.titulo,
                montoTotal: montoCarrito
                    title: pedidoCompleto.titulo;
                quantity: pedidoCompleto.;
                price: montoCarrito;
            });
            if (response?.id) setIdPreference(response.id);
        } catch (error) {
            alert("Error al crear el pedido o la preferencia de Mercado Pago");
        }
    };

    // Inicializa Mercado Pago solo una vez
    initMercadoPago('APP_USR-c6496d8a-6ffe-4a98-abde-aedc89b989b7', { locale: 'es-AR' });

    if (payMethod !== 'MERCADOPAGO') return null;
    //redirectMode es optativo y puede ser self, blank o modal
    return (
        <div className='containerMercado'>
            <button onClick={getPreferenceMP} className="btMercadoPago">
                COMPRAR con <br /> Mercado Pago
            </button>
            <div className={idPreference ? 'divVisible' : 'divInvisible'}>
                <Wallet
                    initialization={{ preferenceId: idPreference, redirectMode: "blank" }}
                    customization={{}} // Puedes omitir esto si no lo usás
                />
            </div>
        </div>
    );

}

export default CheckoutMP