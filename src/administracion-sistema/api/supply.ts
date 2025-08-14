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
        console.log('=== INICIO supplyApi.create ===');
        console.log('Item recibido:', item);

        // SIEMPRE incluir inventoryImageDTO, nunca como null
        let inventoryImageDTO = { imageData: "" }; // Valor por defecto

        // Solo si es para venta Y tiene imagen, sobrescribir
        if (item.forSale && item.inventoryImage?.imageData) {
            let imageData = item.inventoryImage.imageData;
            if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
                const base64 = imageData.split(',')[1];
                inventoryImageDTO = { imageData: base64 };
            } else {
                inventoryImageDTO = { imageData };
            }
        }

        const payload = {
            denomination: item.denomination,
            currentStock: item.currentStock,
            maxStock: item.maxStock,
            buyingPrice: item.buyingPrice,
            measuringUnit: Number(item.measuringUnit?.idmeasuringUnit),
            category: Number(item.category?.idcategory),
            isForSale: item.forSale ?? false,
            inventoryImageDTO, // NUNCA null, siempre un objeto
        };

        console.log('Payload enviado al backend:', payload);

        const res = await fetch(`${BASE_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(payload),
        });

        console.log('Response status:', res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error response:', errorText);
            throw new Error(`Error al crear artículo: ${errorText}`);
        }

        const result = await handleResponse<IArticle>(res);
        console.log('Resultado exitoso:', result);
        console.log('=== FIN supplyApi.create ===');
        
        window.alert('Artículo agregado correctamente');
        return result;
    },

    update: async (updatedItem: IArticle): Promise<IArticle> => {
        // SIEMPRE incluir inventoryImageDTO, nunca como null
        let inventoryImageDTO = { imageData: "" }; // Valor por defecto

        // Solo si es para venta Y tiene imagen, sobrescribir
        if (updatedItem.forSale && updatedItem.inventoryImage?.imageData) {
            let imageData = updatedItem.inventoryImage.imageData;
            if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
                const base64 = imageData.split(',')[1];
                inventoryImageDTO = { imageData: base64 };
            } else {
                inventoryImageDTO = { imageData };
            }
        }

        const payload = {
            denomination: updatedItem.denomination,
            currentStock: updatedItem.currentStock,
            maxStock: updatedItem.maxStock,
            buyingPrice: updatedItem.buyingPrice,
            measuringUnit: Number(updatedItem.measuringUnit?.idmeasuringUnit),
            category: Number(updatedItem.category?.idcategory),
            isForSale: updatedItem.forSale ?? false,
            inventoryImageDTO, // NUNCA null, siempre un objeto
        };

        const res = await fetch(`${BASE_URL}/update/${updatedItem.idarticle}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Error al actualizar artículo: ${errorText}`);
        }

        return handleResponse<IArticle>(res);
    },
};
