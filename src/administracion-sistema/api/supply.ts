// src/administracion-sistema/api/supply.ts

import type { ISupply } from './types/ISupply';

let suppliesMock: ISupply[] = [
    {
        id: 1,
        nombre: 'Pechuga de Pollo',
        unidadMedida: 'kg',
        stockActual: 50,
        stockMinimo: 5,
        costo: 250.00,
        categoria: 'Proteinas',
        subCategoria: 'Carnes Blancas',
        estado: 'Activo',
    },
    {
        id: 2,
        nombre: 'Lechuga Morada',
        unidadMedida: 'unidad',
        stockActual: 30,
        stockMinimo: 3,
        costo: 40.00,
        categoria: 'Vegetales',
        subCategoria: 'Hojas Verdes',
        estado: 'Activo',
    },
    {
        id: 3,
        nombre: 'Leche Entera',
        unidadMedida: 'litro',
        stockActual: 80,
        stockMinimo: 10,
        costo: 90.00,
        categoria: 'Lacteos',
        subCategoria: 'Leches',
        estado: 'Activo',
    },
    {
        id: 4,
        nombre: 'Pan de Hamburguesa',
        unidadMedida: 'unidad',
        stockActual: 200,
        stockMinimo: 20,
        costo: 25.00,
        categoria: 'Panificados',
        subCategoria: 'Panes',
        estado: 'Activo',
    },
    {
        id: 5,
        nombre: 'Cebolla',
        unidadMedida: 'kg',
        stockActual: 40,
        stockMinimo: 4,
        costo: 35.00,
        categoria: 'Vegetales',
        subCategoria: 'Tubérculos y Bulbos',
        estado: 'Activo',
    },
    {
        id: 6,
        nombre: 'Queso Cheddar',
        unidadMedida: 'kg',
        stockActual: 60,
        stockMinimo: 7,
        costo: 180.00,
        categoria: 'Lacteos',
        subCategoria: 'Quesos',
        estado: 'Activo',
    },
    {
        id: 7,
        nombre: 'Lomo de Cerdo',
        unidadMedida: 'kg',
        stockActual: 25,
        stockMinimo: 3,
        costo: 300.00,
        categoria: 'Proteinas',
        subCategoria: 'Carnes Rojas',
        estado: 'Activo',
    },
    {
        id: 8,
        nombre: 'Papas Fritas Congeladas',
        unidadMedida: 'kg',
        stockActual: 150,
        stockMinimo: 15,
        costo: 100.00,
        categoria: 'Vegetales',
        subCategoria: 'Congelados',
        estado: 'Activo',
    },
    {
        id: 9,
        nombre: 'Harina de Trigo',
        unidadMedida: 'kg',
        stockActual: 90,
        stockMinimo: 9,
        costo: 45.00,
        categoria: 'Panificados',
        subCategoria: 'Harinas',
        estado: 'Activo',
    },
    {
        id: 10,
        nombre: 'Huevo',
        unidadMedida: 'docena',
        stockActual: 15,
        stockMinimo: 2,
        costo: 70.00,
        categoria: 'Proteinas',
        subCategoria: 'Huevos',
        estado: 'Activo',
    },
];

const simulateNetworkLatency = (ms: number = 500) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const supplyApi = {
    getAll: async (): Promise<ISupply[]> => {
        await simulateNetworkLatency();
        return [...suppliesMock];
    },

    getById: async (id: number): Promise<ISupply | undefined> => {
        await simulateNetworkLatency();
        return suppliesMock.find(supply => supply.id === id);
    },

    create: async (newItem: Omit<ISupply, 'id'>): Promise<ISupply> => {
        await simulateNetworkLatency();
        const id = suppliesMock.length > 0 ? Math.max(...suppliesMock.map(s => s.id)) + 1 : 1;
        const supply: ISupply = { ...newItem, id };
        suppliesMock.push(supply);
        return supply;
    },

    update: async (updatedItem: ISupply): Promise<ISupply> => {
        await simulateNetworkLatency();
        const index = suppliesMock.findIndex(s => s.id === updatedItem.id);
        if (index > -1) {
            suppliesMock[index] = updatedItem;
            return updatedItem;
        }
        throw new Error('Insumo no encontrado para actualizar.');
    },

    delete: async (id: number): Promise<void> => {
        await simulateNetworkLatency();
        const initialLength = suppliesMock.length;
        suppliesMock = suppliesMock.filter(supply => supply.id !== id);
        if (suppliesMock.length === initialLength) {
            throw new Error('Insumo no encontrado para eliminar.');
        }
    },
};