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
        // Construye el objeto con la estructura requerida por el backend
        const payload: any = {
            denomination: item.denomination,
            currentStock: item.currentStock,
            maxStock: item.maxStock,
            buyingPrice: item.buyingPrice,
            measuringUnit: Number(item.measuringUnit?.idmeasuringUnit), // solo el id
            category: Number(item.category?.idcategory),                // solo el id
            isForSale: item.forSale ?? false,         // usa isForSale
        };

        // Solo agrega inventoryImageDTO si corresponde y si es para venta
        if (
            ( item.forSale) &&
            item.inventoryImage &&
            typeof item.inventoryImage === 'object' &&
            'imageData' in item.inventoryImage &&
            item.inventoryImage.imageData
        ) {
            // Si la imagen viene como dataURL, extrae solo la parte base64
            let imageData = item.inventoryImage.imageData;
            if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
                const base64 = imageData.split(',')[1];
                payload.inventoryImageDTO = { imageData: base64 };
            } else {
                payload.inventoryImageDTO = { imageData };
            }
        }

        const res = await fetch(`${BASE_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(payload),
        });


        window.alert('Artículo agregado correctamente');
        return handleResponse<IArticle>(res);
    },

    update: async (updatedItem: IArticle): Promise<IArticle> => {
        // Construye el objeto con la estructura requerida por el backend
        const payload: any = {
            denomination: updatedItem.denomination,
            currentStock: updatedItem.currentStock,
            maxStock: updatedItem.maxStock,
            buyingPrice: updatedItem.buyingPrice,
            measuringUnit: Number(updatedItem.measuringUnit?.idmeasuringUnit), // solo el id
            category: Number(updatedItem.category?.idcategory),                // solo el id
            isForSale: updatedItem.forSale ?? false, // usa isForSale
        };

        // Solo agrega inventoryImageDTO si corresponde y si es para venta
        if (
            (updatedItem.forSale) &&
            updatedItem.inventoryImage &&
            typeof updatedItem.inventoryImage === 'object' &&
            'imageData' in updatedItem.inventoryImage &&
            updatedItem.inventoryImage.imageData
        ) {
            // Si la imagen viene como dataURL, extrae solo la parte base64
            let imageData = updatedItem.inventoryImage.imageData;
            if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
                const base64 = imageData.split(',')[1];
                payload.inventoryImageDTO = { imageData: base64 };
            } else {
                payload.inventoryImageDTO = { imageData };
            }
        }

        const res = await fetch(`${BASE_URL}/update/${updatedItem.idarticle}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(payload),
        });
        return handleResponse<IArticle>(res);
    },

  
};
