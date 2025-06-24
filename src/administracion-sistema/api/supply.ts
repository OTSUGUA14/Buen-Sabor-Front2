// src/administracion-sistema/api/supply.ts

import type { IArticle } from './types/IArticle';


const BASE_URL = 'http://localhost:8080/article';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
    }
    return response.json();
}
export type SimpleArticle = {
    denomination: string;
    currentStock: number;
    maxStock: number;
    buyingPrice: number;
    measuringUnit: number; // id de la unidad
    category: number;      // id de la categoría
};

export const supplyApi = {
    getAll: async (): Promise<IArticle[]> => {
        const res = await fetch(`${BASE_URL}/getAll`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
        });
        return handleResponse<IArticle[]>(res);
    },

    getById: async (id: number): Promise<IArticle> => {
        const res = await fetch(`${BASE_URL}/getAll/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
        });
        return handleResponse<IArticle>(res);
    },


    create: async (item: Omit<IArticle, "id">): Promise<IArticle> => {
        console.log(item);
        
        // Transforma el objeto a SimpleArticle
        const simple: SimpleArticle = {
            denomination: item.denomination,
            currentStock: item.currentStock,
            maxStock: item.maxStock,
            buyingPrice: item.buyingPrice,
            measuringUnit: Number(item.measuringUnit.idmeasuringUnit),
            category:Number( item.category.idcategory),
        };
        const res = await fetch(`${BASE_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(simple),
        });
        console.log(simple);

        return handleResponse<IArticle>(res);
    },

    update: async (updatedItem: IArticle): Promise<IArticle> => {

        console.log(updatedItem);


        const res = await fetch(`${BASE_URL}/update/${updatedItem.idarticle}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(updatedItem),
        });
        return handleResponse<IArticle>(res);
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${BASE_URL}/delete/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Error ${res.status}: ${text}`);
        }
    },
};
