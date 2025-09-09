import type { ICategory } from './types/ICategory';

const BASE_URL = 'http://localhost:8080/category';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
    }
    return response.json();
}

export const categoryApi = {
    getAll: async (): Promise<ICategory[]> => {
        const res = await fetch(`${BASE_URL}/getAll`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
        });
        return handleResponse<ICategory[]>(res);
    },

    getById: async (id: number): Promise<ICategory> => {
        const res = await fetch(`${BASE_URL}/getById/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
        });
        return handleResponse<ICategory>(res);
    },

    create: async (newItem: Omit<ICategory, 'id' | 'IDCategory'>): Promise<ICategory> => {
        console.log('=== INICIO categoryApi.create ===');
        console.log('newItem recibido:', newItem);
        
        const body = {
            name: newItem.name,
            isForsale: newItem.forSale,
            isEnabled: newItem.enabled, // <-- agregado
        };
        
        console.log('Body a enviar al backend:', body);
        console.log('URL:', `${BASE_URL}/add`);
        
        try {
            const res = await fetch(`${BASE_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors',
                body: JSON.stringify(body),
            });
            
            console.log('Response status:', res.status);
            console.log('Response ok:', res.ok);
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error response text:', errorText);
                throw new Error(`Error ${res.status}: ${errorText}`);
            }
            
            const result = await res.json();
            console.log('Resultado exitoso:', result);
            console.log('=== FIN categoryApi.create ===');
            return result;
        } catch (error) {
            console.error('Error en fetch:', error);
            throw error;
        }
    },

    update: async (updatedItem: ICategory): Promise<ICategory> => {
        const body = {
            name: updatedItem.name,
            isForsale: updatedItem.forSale,
            isEnabled: updatedItem.enabled, // <-- agregado
        };
        const res = await fetch(`${BASE_URL}/update/${updatedItem.IDCategory}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(body),
        });
        return handleResponse<ICategory>(res);
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
