// src/administracion-sistema/api/product.ts

import type { IProduct } from './types/product';

let productsMock: IProduct[] = [
    {
        id: 1000,
        nombre: 'Clásica de la casa',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 3, nombre: 'Lechuga' },
            { id: 4, nombre: 'Tomate' },
            { id: 5, nombre: 'Cebolla morada' }
        ],
        precioVenta: 7500,
        ofertaPorcentaje: 10,
        stock: 123,
        estado: 'Activo',
    },
    {
        id: 1001,
        nombre: 'Hamburguesa Bacon y Huevo',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 7, nombre: 'Huevo' }
        ],
        precioVenta: 8500,
        ofertaPorcentaje: 0,
        stock: 2,
        estado: 'Activo',
    },
    {
        id: 1002,
        nombre: 'Hamburguesa Cebolla y Bacon',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 8, nombre: 'Cebolla caramelizada' }
        ],
        precioVenta: 9000,
        ofertaPorcentaje: 0,
        stock: 76,
        estado: 'Activo',
    },
    {
        id: 1003,
        nombre: 'Pizza 4 quesos',
        rubro: 'Pizza',
        ingredientes: [
            { id: 9, nombre: 'Harina 0000 (500grs)' },
            { id: 10, nombre: 'Muzzarella' },
            { id: 11, nombre: 'Provolone' },
            { id: 12, nombre: 'Roquefort' },
            { id: 13, nombre: 'Parmesano' }
        ],
        precioVenta: 8000,
        ofertaPorcentaje: 0,
        stock: 0,
        estado: 'Inactivo',
    },
    {
        id: 1000,
        nombre: 'Clásica de la casa',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 3, nombre: 'Lechuga' },
            { id: 4, nombre: 'Tomate' },
            { id: 5, nombre: 'Cebolla morada' }
        ],
        precioVenta: 7500,
        ofertaPorcentaje: 10,
        stock: 123,
        estado: 'Activo',
    },
    {
        id: 1001,
        nombre: 'Hamburguesa Bacon y Huevo',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 7, nombre: 'Huevo' }
        ],
        precioVenta: 8500,
        ofertaPorcentaje: 0,
        stock: 2,
        estado: 'Activo',
    },
    {
        id: 1002,
        nombre: 'Hamburguesa Cebolla y Bacon',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 8, nombre: 'Cebolla caramelizada' }
        ],
        precioVenta: 9000,
        ofertaPorcentaje: 0,
        stock: 76,
        estado: 'Activo',
    },
    {
        id: 1003,
        nombre: 'Pizza 4 quesos',
        rubro: 'Pizza',
        ingredientes: [
            { id: 9, nombre: 'Harina 0000 (500grs)' },
            { id: 10, nombre: 'Muzzarella' },
            { id: 11, nombre: 'Provolone' },
            { id: 12, nombre: 'Roquefort' },
            { id: 13, nombre: 'Parmesano' }
        ],
        precioVenta: 8000,
        ofertaPorcentaje: 0,
        stock: 0,
        estado: 'Inactivo',
    },
    {
        id: 1000,
        nombre: 'Clásica de la casa',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 3, nombre: 'Lechuga' },
            { id: 4, nombre: 'Tomate' },
            { id: 5, nombre: 'Cebolla morada' }
        ],
        precioVenta: 7500,
        ofertaPorcentaje: 10,
        stock: 123,
        estado: 'Activo',
    },
    {
        id: 1001,
        nombre: 'Hamburguesa Bacon y Huevo',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 7, nombre: 'Huevo' }
        ],
        precioVenta: 8500,
        ofertaPorcentaje: 0,
        stock: 2,
        estado: 'Activo',
    },
    {
        id: 1002,
        nombre: 'Hamburguesa Cebolla y Bacon',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 8, nombre: 'Cebolla caramelizada' }
        ],
        precioVenta: 9000,
        ofertaPorcentaje: 0,
        stock: 76,
        estado: 'Activo',
    },
    {
        id: 1003,
        nombre: 'Pizza 4 quesos',
        rubro: 'Pizza',
        ingredientes: [
            { id: 9, nombre: 'Harina 0000 (500grs)' },
            { id: 10, nombre: 'Muzzarella' },
            { id: 11, nombre: 'Provolone' },
            { id: 12, nombre: 'Roquefort' },
            { id: 13, nombre: 'Parmesano' }
        ],
        precioVenta: 8000,
        ofertaPorcentaje: 0,
        stock: 0,
        estado: 'Inactivo',
    },
    {
        id: 1000,
        nombre: 'Clásica de la casa',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 3, nombre: 'Lechuga' },
            { id: 4, nombre: 'Tomate' },
            { id: 5, nombre: 'Cebolla morada' }
        ],
        precioVenta: 7500,
        ofertaPorcentaje: 10,
        stock: 123,
        estado: 'Activo',
    },
    {
        id: 1001,
        nombre: 'Hamburguesa Bacon y Huevo',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 7, nombre: 'Huevo' }
        ],
        precioVenta: 8500,
        ofertaPorcentaje: 0,
        stock: 2,
        estado: 'Activo',
    },
    {
        id: 1002,
        nombre: 'Hamburguesa Cebolla y Bacon',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 8, nombre: 'Cebolla caramelizada' }
        ],
        precioVenta: 9000,
        ofertaPorcentaje: 0,
        stock: 76,
        estado: 'Activo',
    },
    {
        id: 1003,
        nombre: 'Pizza 4 quesos',
        rubro: 'Pizza',
        ingredientes: [
            { id: 9, nombre: 'Harina 0000 (500grs)' },
            { id: 10, nombre: 'Muzzarella' },
            { id: 11, nombre: 'Provolone' },
            { id: 12, nombre: 'Roquefort' },
            { id: 13, nombre: 'Parmesano' }
        ],
        precioVenta: 8000,
        ofertaPorcentaje: 0,
        stock: 0,
        estado: 'Inactivo',
    },
    {
        id: 1000,
        nombre: 'Clásica de la casa',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 3, nombre: 'Lechuga' },
            { id: 4, nombre: 'Tomate' },
            { id: 5, nombre: 'Cebolla morada' }
        ],
        precioVenta: 7500,
        ofertaPorcentaje: 10,
        stock: 123,
        estado: 'Activo',
    },
    {
        id: 1001,
        nombre: 'Hamburguesa Bacon y Huevo',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 7, nombre: 'Huevo' }
        ],
        precioVenta: 8500,
        ofertaPorcentaje: 0,
        stock: 2,
        estado: 'Activo',
    },
    {
        id: 1002,
        nombre: 'Hamburguesa Cebolla y Bacon',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 8, nombre: 'Cebolla caramelizada' }
        ],
        precioVenta: 9000,
        ofertaPorcentaje: 0,
        stock: 76,
        estado: 'Activo',
    },
    {
        id: 1003,
        nombre: 'Pizza 4 quesos',
        rubro: 'Pizza',
        ingredientes: [
            { id: 9, nombre: 'Harina 0000 (500grs)' },
            { id: 10, nombre: 'Muzzarella' },
            { id: 11, nombre: 'Provolone' },
            { id: 12, nombre: 'Roquefort' },
            { id: 13, nombre: 'Parmesano' }
        ],
        precioVenta: 8000,
        ofertaPorcentaje: 0,
        stock: 0,
        estado: 'Inactivo',
    },
    {
        id: 1000,
        nombre: 'Clásica de la casa',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 3, nombre: 'Lechuga' },
            { id: 4, nombre: 'Tomate' },
            { id: 5, nombre: 'Cebolla morada' }
        ],
        precioVenta: 7500,
        ofertaPorcentaje: 10,
        stock: 123,
        estado: 'Activo',
    },
    {
        id: 1001,
        nombre: 'Hamburguesa Bacon y Huevo',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 7, nombre: 'Huevo' }
        ],
        precioVenta: 8500,
        ofertaPorcentaje: 0,
        stock: 2,
        estado: 'Activo',
    },
    {
        id: 1002,
        nombre: 'Hamburguesa Cebolla y Bacon',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 8, nombre: 'Cebolla caramelizada' }
        ],
        precioVenta: 9000,
        ofertaPorcentaje: 0,
        stock: 76,
        estado: 'Activo',
    },
    {
        id: 1003,
        nombre: 'Pizza 4 quesos',
        rubro: 'Pizza',
        ingredientes: [
            { id: 9, nombre: 'Harina 0000 (500grs)' },
            { id: 10, nombre: 'Muzzarella' },
            { id: 11, nombre: 'Provolone' },
            { id: 12, nombre: 'Roquefort' },
            { id: 13, nombre: 'Parmesano' }
        ],
        precioVenta: 8000,
        ofertaPorcentaje: 0,
        stock: 0,
        estado: 'Inactivo',
    },
    {
        id: 1000,
        nombre: 'Clásica de la casa',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 3, nombre: 'Lechuga' },
            { id: 4, nombre: 'Tomate' },
            { id: 5, nombre: 'Cebolla morada' }
        ],
        precioVenta: 7500,
        ofertaPorcentaje: 10,
        stock: 123,
        estado: 'Activo',
    },
    {
        id: 1001,
        nombre: 'Hamburguesa Bacon y Huevo',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 7, nombre: 'Huevo' }
        ],
        precioVenta: 8500,
        ofertaPorcentaje: 0,
        stock: 2,
        estado: 'Activo',
    },
    {
        id: 1002,
        nombre: 'Hamburguesa Cebolla y Bacon',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 8, nombre: 'Cebolla caramelizada' }
        ],
        precioVenta: 9000,
        ofertaPorcentaje: 0,
        stock: 76,
        estado: 'Activo',
    },
    {
        id: 1003,
        nombre: 'Pizza 4 quesos',
        rubro: 'Pizza',
        ingredientes: [
            { id: 9, nombre: 'Harina 0000 (500grs)' },
            { id: 10, nombre: 'Muzzarella' },
            { id: 11, nombre: 'Provolone' },
            { id: 12, nombre: 'Roquefort' },
            { id: 13, nombre: 'Parmesano' }
        ],
        precioVenta: 8000,
        ofertaPorcentaje: 0,
        stock: 0,
        estado: 'Inactivo',
    },
    {
        id: 1000,
        nombre: 'Clásica de la casa',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 3, nombre: 'Lechuga' },
            { id: 4, nombre: 'Tomate' },
            { id: 5, nombre: 'Cebolla morada' }
        ],
        precioVenta: 7500,
        ofertaPorcentaje: 10,
        stock: 123,
        estado: 'Activo',
    },
    {
        id: 1001,
        nombre: 'Hamburguesa Bacon y Huevo',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 7, nombre: 'Huevo' }
        ],
        precioVenta: 8500,
        ofertaPorcentaje: 0,
        stock: 2,
        estado: 'Activo',
    },
    {
        id: 1002,
        nombre: 'Hamburguesa Cebolla y Bacon',
        rubro: 'Hamburguesa',
        ingredientes: [
            { id: 1, nombre: 'Pan de papa' },
            { id: 2, nombre: 'Medallon de carne' },
            { id: 6, nombre: 'Bacon' },
            { id: 8, nombre: 'Cebolla caramelizada' }
        ],
        precioVenta: 9000,
        ofertaPorcentaje: 0,
        stock: 76,
        estado: 'Activo',
    },
    {
        id: 1003,
        nombre: 'Pizza 4 quesos',
        rubro: 'Pizza',
        ingredientes: [
            { id: 9, nombre: 'Harina 0000 (500grs)' },
            { id: 10, nombre: 'Muzzarella' },
            { id: 11, nombre: 'Provolone' },
            { id: 12, nombre: 'Roquefort' },
            { id: 13, nombre: 'Parmesano' }
        ],
        precioVenta: 8000,
        ofertaPorcentaje: 0,
        stock: 0,
        estado: 'Inactivo',
    },
];

export const productApi = {
    getAll: async (): Promise<IProduct[]> => {
        return Promise.resolve(productsMock);
    },

    getById: async (id: number): Promise<IProduct | undefined> => {
        return Promise.resolve(productsMock.find(p => p.id === id));
    },

    // 'item' acepta Omit<IProduct, 'id'> para la creación
    create: async (item: Omit<IProduct, 'id'>): Promise<IProduct> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newId = Math.max(...productsMock.map(p => p.id), 0) + 1;
                const newProduct: IProduct = {
                    ...item,
                    id: newId,
                    // Asegúrate de que 'ingredientes' no sea undefined si el formulario lo permite
                    ingredientes: item.ingredientes || [],
                };
                productsMock.push(newProduct);
                resolve(newProduct);
            }, 500);
        });
    },

    // 'item' acepta IProduct (con id) para la actualización
    update: async (item: IProduct): Promise<IProduct> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = productsMock.findIndex(p => p.id === item.id);
                if (index > -1) {
                    productsMock[index] = item;
                    resolve(item);
                } else {
                    reject(new Error('Producto no encontrado para actualizar.'));
                }
            }, 500);
        });
    },

    delete: async (id: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const initialLength = productsMock.length;
                productsMock = productsMock.filter(p => p.id !== id);
                if (productsMock.length < initialLength) {
                    resolve();
                } else {
                    reject(new Error('Producto no encontrado para eliminar.'));
                }
            }, 500);
        });
    },
};