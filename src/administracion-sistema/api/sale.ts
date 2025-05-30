// src/administracion-sistema/api/sale.ts

import type { ISale } from './types/ISale';
import type { IProduct } from './types/IProduct';

const mockProducts: IProduct[] = [
    {
        id: 1000,
        nombre: 'Clásica de la casa',
        descripcion: 'La hamburguesa clásica con lechuga, tomate y cebolla morada.',
        rubro: 'Hamburguesa', // Rubro como literal
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
        rubro: 'Pizza', // Rubro como literal
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
        nombre: 'Papas Fritas Grandes',
        descripcion: 'Porción extra grande de papas crujientes.',
        rubro: 'Ensalada', // Ajustado a los rubros literales de IProduct
        ingredientes: [],
        precioVenta: 4000,
        ofertaPorcentaje: 0,
        stock: 80,
        estado: 'Activo',
    },
    {
        id: 1005,
        nombre: 'Agua Mineral 500ml',
        descripcion: 'Agua mineral sin gas, botella personal.',
        rubro: 'Bebida', // Rubro como literal
        ingredientes: [],
        precioVenta: 1500,
        ofertaPorcentaje: 0,
        stock: 150,
        estado: 'Activo',
    },
];

let salesData: ISale[] = [
    { id: 1, productId: 1000, productName: 'Clásica de la casa', quantity: 2, unitPrice: 7500, saleDate: '2025-03-05' },
    { id: 2, productId: 1001, productName: 'Hamburguesa Bacon y Huevo', quantity: 3, unitPrice: 8500, saleDate: '2025-03-08' },
    { id: 3, productId: 1000, productName: 'Clásica de la casa', quantity: 1, unitPrice: 7500, saleDate: '2025-03-12' },
    { id: 4, productId: 1003, productName: 'Pizza 4 quesos', quantity: 5, unitPrice: 8000, saleDate: '2025-03-18' },
    { id: 21, productId: 1004, productName: 'Papas Fritas Grandes', quantity: 7, unitPrice: 4000, saleDate: '2025-03-25' },
    { id: 22, productId: 1005, productName: 'Agua Mineral 500ml', quantity: 10, unitPrice: 1500, saleDate: '2025-04-02' },
    { id: 5, productId: 1000, productName: 'Clásica de la casa', quantity: 3, unitPrice: 7500, saleDate: '2025-04-05' },
    { id: 6, productId: 1001, productName: 'Hamburguesa Bacon y Huevo', quantity: 2, unitPrice: 8500, saleDate: '2025-04-09' },
    { id: 7, productId: 1004, productName: 'Papas Fritas Grandes', quantity: 4, unitPrice: 4000, saleDate: '2025-04-14' },
    { id: 8, productId: 1000, productName: 'Clásica de la casa', quantity: 5, unitPrice: 7500, saleDate: '2025-04-18' },
    { id: 9, productId: 1003, productName: 'Pizza 4 quesos', quantity: 10, unitPrice: 8000, saleDate: '2025-04-22' },
    { id: 10, productId: 1001, productName: 'Hamburguesa Bacon y Huevo', quantity: 1, unitPrice: 8500, saleDate: '2025-04-26' },
    { id: 11, productId: 1000, productName: 'Clásica de la casa', quantity: 2, unitPrice: 7500, saleDate: '2025-05-01' },
    { id: 12, productId: 1004, productName: 'Papas Fritas Grandes', quantity: 3, unitPrice: 4000, saleDate: '2025-05-03' },
    { id: 13, productId: 1001, productName: 'Hamburguesa Bacon y Huevo', quantity: 4, unitPrice: 8500, saleDate: '2025-05-06' },
    { id: 14, productId: 1003, productName: 'Pizza 4 quesos', quantity: 8, unitPrice: 8000, saleDate: '2025-05-09' },
    { id: 15, productId: 1000, productName: 'Clásica de la casa', quantity: 6, unitPrice: 7500, saleDate: '2025-05-12' },
    { id: 16, productId: 1004, productName: 'Papas Fritas Grandes', quantity: 2, unitPrice: 4000, saleDate: '2025-05-15' },
    { id: 17, productId: 1001, productName: 'Hamburguesa Bacon y Huevo', quantity: 3, unitPrice: 8500, saleDate: '2025-05-17' },
    { id: 18, productId: 1000, productName: 'Clásica de la casa', quantity: 4, unitPrice: 7500, saleDate: '2025-05-20' },
    { id: 19, productId: 1003, productName: 'Pizza 4 quesos', quantity: 12, unitPrice: 8000, saleDate: '2025-05-23' },
    { id: 20, productId: 1001, productName: 'Hamburguesa Bacon y Huevo', quantity: 5, unitPrice: 8500, saleDate: '2025-05-25' },
    { id: 23, productId: 1000, productName: 'Clásica de la casa', quantity: 1, unitPrice: 7500, saleDate: '2025-05-26' },
    { id: 24, productId: 1005, productName: 'Agua Mineral 500ml', quantity: 20, unitPrice: 1500, saleDate: '2025-05-27' },
    { id: 25, productId: 1000, productName: 'Clásica de la casa', quantity: 8, unitPrice: 7500, saleDate: '2025-05-28' },
    { id: 26, productId: 1001, productName: 'Hamburguesa Bacon y Huevo', quantity: 6, unitPrice: 8500, saleDate: '2025-05-28' },
    { id: 27, productId: 1004, productName: 'Papas Fritas Grandes', quantity: 5, unitPrice: 4000, saleDate: '2025-05-29' },
    { id: 28, productId: 1000, productName: 'Clásica de la casa', quantity: 3, unitPrice: 7500, saleDate: '2025-05-29' },
    { id: 29, productId: 1005, productName: 'Agua Mineral 500ml', quantity: 15, unitPrice: 1500, saleDate: '2025-05-29' },
];

const simulateNetworkLatency = (ms: number = 500) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const saleApi = {
    getSalesByDateRange: async (startDate: string, endDate: string): Promise<ISale[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const filtered = salesData.filter(sale => {
                    const saleDate = sale.saleDate;
                    return saleDate >= startDate && saleDate <= endDate;
                });
                resolve([...filtered]);
            }, 700);
        });
    },
};