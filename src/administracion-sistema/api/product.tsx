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
        const {
            idmanufacturedArticle,
            name,
            description,
            price,
            estimatedTimeMinutes,
            isAvailable,
            manufacturedArticleDetail,
            manufacInventoryImage // <-- Agrega la imagen aquí
        } = product;

        const body = {
            name,
            description,
            price,
            estimatedTimeMinutes,
            isAvailable,
            manufacturedArticleDetail,
            manufacInventoryImage // <-- Y aquí también
        };
        console.log(body);
        
        const response = await fetch(`http://localhost:8080/manufacturedArticle/update/${idmanufacturedArticle}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error('Error al actualizar producto');
        return await response.json();
    },
    getAll: async () => {
        const rawProducts = await getProductsAll();
        return rawProducts.map((p: any) => ({
            ...p,
            isAvailable: p.available, // convierte el campo si existe
        }));
    },
    getById: async (id: number): Promise<IProduct | undefined> => {
        const allProducts = await getProductsAll();
        return allProducts.find(p => p.id === id);
    },
    delete: async (id: number): Promise<void> => {
        throw new Error('No implementado: eliminar producto remoto');
    }
};