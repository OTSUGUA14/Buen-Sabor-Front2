
import type { IProduct } from './types/IProduct';

let productsMock: IProduct[] = [
    {
        id: 1000,
        nombre: 'Clásica de la casa',
        descripcion: 'La hamburguesa clásica con lechuga, tomate y cebolla morada.', 
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
        descripcion: 'Jugosa hamburguesa con crujiente bacon y huevo frito.', 
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
        descripcion: 'Combinación perfecta de cebolla caramelizada y bacon ahumado.', 
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
        descripcion: 'Deliciosa pizza con la mezcla de cuatro quesos gourmet.', 
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
        id: 1004,
        nombre: 'Gaseosa Cola 1.5L', 
        descripcion: 'Refresco clásico de cola en botella de 1.5 litros.',
        rubro: 'Bebida',
        ingredientes: [],
        precioVenta: 3000,
        ofertaPorcentaje: 0,
        stock: 50,
        estado: 'Activo',
    },
    {
        id: 1005,
        nombre: 'Ensalada de Pollo Caesar', 
        descripcion: 'Fresca ensalada con pollo a la parrilla, lechuga y aderezo Caesar.',
        rubro: 'Ensalada',
        ingredientes: [],
        precioVenta: 6000,
        ofertaPorcentaje: 0,
        stock: 30,
        estado: 'Activo',
    },
];

export const productApi = {
    getAll: async (): Promise<IProduct[]> => {
        return Promise.resolve([...productsMock]); 
    },

    getById: async (id: number): Promise<IProduct | undefined> => {
        return Promise.resolve(productsMock.find(p => p.id === id));
    },

    create: async (item: Omit<IProduct, 'id'>): Promise<IProduct> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newId = Math.max(...productsMock.map(p => p.id), 0) + 1;
                const newProduct: IProduct = {
                    ...item,
                    id: newId,
                    ingredientes: item.ingredientes || [],
                };
                productsMock.push(newProduct);
                resolve(newProduct);
            }, 500);
        });
    },

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