
import { getProductsAll } from '../utils/Api';
import type { IProduct } from './types/IProduct';



export const productApi = {
    getAll: async (): Promise<IProduct[]> => {

        return getProductsAll();
        
    },

    getById: async (id: number): Promise<IProduct | undefined> => {
        const allProducts = await getProductsAll();
        return allProducts.find(p => p.id === id);
    },

    create: async (item: Omit<IProduct, 'id'>): Promise<IProduct> => {
        // Aquí deberías hacer un POST al backend real, por ahora lanza error o mock
        throw new Error('No implementado: crear producto remoto');
    },

    update: async (item: IProduct): Promise<IProduct> => {
        // Aquí deberías hacer un PUT/PATCH al backend real, por ahora lanza error o mock
        throw new Error('No implementado: actualizar producto remoto');
    },

    delete: async (id: number): Promise<void> => {
        // Aquí deberías hacer un DELETE al backend real, por ahora lanza error o mock
        throw new Error('No implementado: eliminar producto remoto');
    }
};