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
    getById: async (id: number): Promise<ISale> => {
        const res = await fetch(`http://localhost:8080/sale/get/${id}`);
        if (!res.ok) throw new Error('Error al obtener la oferta');
        return res.json();
    },

    create: async (item: Omit<ISale, "id">): Promise<ISale> => {
        // Si necesitas enviar "IDSale" al backend, haz la conversión aquí
        const { id, ...rest } = item as any;
        const saleToSend = { ...rest, ...(id && { IDSale: id }) };

        const res = await fetch('http://localhost:8080/sale/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleToSend),
        });
        if (!res.ok) throw new Error('Error al crear la oferta');
        return res.json();
    },

    update: async (sale: ISale): Promise<ISale> => {
        const res = await fetch(`${BASE_URL}/update/${sale.idsale}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(sale),
        });
        if (!res.ok) throw new Error('Error al actualizar venta');
        return res.json();
    },
    
};