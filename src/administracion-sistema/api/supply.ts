// src/administracion-sistema/api/supply.ts

import type { ISupply } from './types/ISupply'; // Asumimos que esta interfaz ha sido actualizada

// Datos mock para insumos - ACTUALIZADOS
let suppliesMock: ISupply[] = [
    {
        id: 1,
        nombre: 'Harina 0000',
        unidadMedida: 'kg',
        stockActual: 100,
        stockMinimo: 10,
        costo: 50.00,
        categoria: 'Materia Prima', // Nuevo campo
        subCategoria: 'Cereales y Legumbres', // Nuevo campo
        estado: 'Activo', // Nuevo campo
        // esInsumo: true, // ELIMINADO
    },
    {
        id: 2,
        nombre: 'Tomate Perita',
        unidadMedida: 'kg',
        stockActual: 50,
        stockMinimo: 5,
        costo: 30.00,
        categoria: 'Materia Prima',
        subCategoria: 'Vegetales',
        estado: 'Activo',
        // esInsumo: true, // ELIMINADO
    },
    {
        id: 3,
        nombre: 'Queso Mozzarella',
        unidadMedida: 'kg',
        stockActual: 70,
        stockMinimo: 8,
        costo: 120.00,
        categoria: 'Materia Prima',
        subCategoria: 'Lácteos',
        estado: 'Activo',
        // esInsumo: true, // ELIMINADO
    },
    {
        id: 4,
        nombre: 'Cerveza Patagonia',
        unidadMedida: 'litro',
        stockActual: 200,
        stockMinimo: 20,
        costo: 80.00,
        categoria: 'Bebidas',
        subCategoria: 'Cervezas',
        estado: 'Activo',
        // esInsumo: false, // ELIMINADO
    },
    {
        id: 5,
        nombre: 'Aceitunas Verdes',
        unidadMedida: 'kg',
        stockActual: 30,
        stockMinimo: 3,
        costo: 60.00,
        categoria: 'Materia Prima',
        subCategoria: 'Vegetales',
        estado: 'Activo',
        // esInsumo: true, // ELIMINADO
    },
];

// Función utilitaria para simular una latencia de red
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