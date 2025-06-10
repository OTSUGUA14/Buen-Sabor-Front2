
import { getProductsAll } from '../utils/Api';
import type { IProduct } from './types/IProduct';



export const productApi = {
    create: async (product: Omit<IProduct, 'id'>) => {
        const response = await fetch('http://localhost:8080/manufacturedArticle/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!response.ok) throw new Error('Error al crear producto');
        return await response.json();
    },
    update: async (product: IProduct) => {
        const response = await fetch(`http://localhost:8080/manufacturedArticle/update/${product.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!response.ok) throw new Error('Error al actualizar producto');
        return await response.json();
    },
    getAll: async (): Promise<IProduct[]> => {
        return getProductsAll();
    },
    getById: async (id: number): Promise<IProduct | undefined> => {
        const allProducts = await getProductsAll();
        return allProducts.find(p => p.id === id);
    },
    delete: async (id: number): Promise<void> => {
        throw new Error('No implementado: eliminar producto remoto');
    }
};