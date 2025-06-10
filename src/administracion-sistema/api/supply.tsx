// src/administracion-sistema/api/supply.ts

import type { IIngrediente } from './types/IIngrediente';





// src/administracion-sistema/api/supplyApi.ts



const BASE_URL = 'http://localhost:8080/article';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
    }
    return response.json();
}

export const supplyApi = {
    getAll: async (): Promise<IIngrediente[]> => {
        const res = await fetch(`${BASE_URL}/getAll`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
        });
        return handleResponse<IIngrediente[]>(res);
    },

    getById: async (id: number): Promise<IIngrediente> => {
        const res = await fetch(`${BASE_URL}/getAll/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
        });
        return handleResponse<IIngrediente>(res);
    },

    create: async (newItem: Omit<IIngrediente, 'id' | 'idArticulo'>): Promise<IIngrediente> => {
        const res = await fetch(`${BASE_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(newItem),
        });
        return handleResponse<IIngrediente>(res);
    },

    update: async (updatedItem: IIngrediente): Promise<IIngrediente> => {
        const res = await fetch(`${BASE_URL}/update/${updatedItem.idArticulo}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(updatedItem),
        });
        return handleResponse<IIngrediente>(res);
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
        // No devolvemos nada (void)
    },
};
