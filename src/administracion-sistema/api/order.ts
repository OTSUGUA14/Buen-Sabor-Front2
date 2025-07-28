import { type IOrder } from './types/IOrder.ts';

const BASE_URL = 'http://localhost:8080/api/orders';

export const orderApi = {
    getAll: async (): Promise<IOrder[]> => {
        const response = await fetch(BASE_URL);
        const data: IOrder[] = await response.json();
        return data.map(order => ({
            ...order,
            // ✅ Mapear campos para compatibilidad con el código existente
            clientId: order.client?.clientId,
            clientName: `${order.client?.firstName || ''} ${order.client?.lastName || ''}`.trim(),
            tipoEntrega: order.orderType === 'TAKEAWAY' ? 'LOCAL' : 'DELIVERY',
        }));
    },

    getById: async (id: number): Promise<IOrder | null> => {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) return null;
        return await response.json();
    },

    create: async (order: Omit<IOrder, "id">): Promise<IOrder> => {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        if (!response.ok) {
            throw new Error('Error al crear la orden');
        }
        return await response.json();
    },

    update: async (order: IOrder): Promise<IOrder> => {
        const res = await fetch(`${BASE_URL}/update/${order.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        });
        if (!res.ok) {
            throw new Error('Error updating order');
        }
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
        });
    },
};
