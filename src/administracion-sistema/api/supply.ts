// src/administracion-sistema/api/supply.ts

import type { ISupply } from './types/supply';

// Datos mock para insumos
let suppliesMock: ISupply[] = [
    {
        id: 1,
        nombre: 'Harina 0000',
        unidadMedida: 'kg',
        stockActual: 100,
        stockMinimo: 10,
        costo: 50.00,
        esInsumo: true, // <-- Asegúrate de que exista y sea booleano
    },
    {
        id: 2,
        nombre: 'Tomate Perita',
        unidadMedida: 'kg',
        stockActual: 50,
        stockMinimo: 5,
        costo: 30.00,
        esInsumo: true, // <-- Asegúrate de que exista y sea booleano
    },
    {
        id: 3,
        nombre: 'Queso Mozzarella',
        unidadMedida: 'kg',
        stockActual: 70,
        stockMinimo: 8,
        costo: 120.00,
        esInsumo: true, // <-- Asegúrate de que exista y sea booleano
    },
    {
        id: 4,
        nombre: 'Cerveza Patagonia',
        unidadMedida: 'litro',
        stockActual: 200,
        stockMinimo: 20,
        costo: 80.00,
        esInsumo: false, // <-- Un ejemplo de producto final o bebida
    },
    {
        id: 5,
        nombre: 'Aceitunas Verdes',
        unidadMedida: 'kg',
        stockActual: 30,
        stockMinimo: 3,
        costo: 60.00,
        esInsumo: true, // <-- Asegúrate de que exista y sea booleano
    },
];

// Función utilitaria para simular una latencia de red
const simulateNetworkLatency = (ms: number = 500) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const supplyApi = {
    // Cambia getAllSupplies a getAll
    getAll: async (): Promise<ISupply[]> => {
        await simulateNetworkLatency();
        return [...suppliesMock];
    },

    getSupplyById: async (id: number): Promise<ISupply | undefined> => {
        await simulateNetworkLatency();
        return suppliesMock.find(supply => supply.id === id);
    },

    createSupply: async (newSupply: Omit<ISupply, 'id'>): Promise<ISupply> => {
        await simulateNetworkLatency();
        const id = Math.max(...suppliesMock.map(s => s.id)) + 1;
        const supply: ISupply = { ...newSupply, id };
        suppliesMock.push(supply);
        return supply;
    },

    updateSupply: async (updatedSupply: ISupply): Promise<ISupply> => {
        await simulateNetworkLatency();
        const index = suppliesMock.findIndex(s => s.id === updatedSupply.id);
        if (index > -1) {
            suppliesMock[index] = updatedSupply;
            return updatedSupply;
        }
        throw new Error('Insumo no encontrado para actualizar.');
    },

    deleteSupply: async (id: number): Promise<void> => {
        await simulateNetworkLatency();
        const initialLength = suppliesMock.length;
        suppliesMock = suppliesMock.filter(supply => supply.id !== id);
        if (suppliesMock.length === initialLength) {
            throw new Error('Insumo no encontrado para eliminar.');
        }
    },
};