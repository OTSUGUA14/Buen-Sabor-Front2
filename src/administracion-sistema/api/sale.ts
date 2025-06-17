import { type ISale } from './types/ISale';

const BASE_URL = 'http://localhost:8080/sale';

export const saleApi = {
    getAll: async (): Promise<ISale[]> => {
        const res = await fetch(`${BASE_URL}/getAll`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
        });
        if (!res.ok) throw new Error('Error al obtener ventas');
        return res.json();
    },

    create: async (sale: Omit<ISale, 'IDSale'>): Promise<ISale> => {
        const res = await fetch(`${BASE_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(sale),
        });
        if (!res.ok) throw new Error('Error al crear venta');
        return res.json();
    },

    update: async (sale: ISale): Promise<ISale> => {
        const res = await fetch(`${BASE_URL}/update/${sale.IDSale}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(sale),
        });
        if (!res.ok) throw new Error('Error al actualizar venta');
        return res.json();
    },
};