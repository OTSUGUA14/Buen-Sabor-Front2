// src/administracion-sistema/api/client.ts

// No es necesario importar CrudApi si no tienes un archivo CrudApi.ts.
// TypeScript infiere que 'clientApi' cumple la forma que 'useCrud' espera.

import type { IClient } from './types/IClient'; // Asegúrate de que esta ruta sea correcta

// Datos de clientes mock
let clientsData: IClient[] = [
    { id: 1, nombre: 'Juan Pérez', correo: 'juan.perez@example.com', direccion: 'Calle Falsa 123', estado: 'Activo' },
    { id: 2, nombre: 'María García', correo: 'maria.garcia@example.com', direccion: 'Av. Siempre Viva 742', estado: 'Activo' },
    { id: 3, nombre: 'Carlos López', correo: 'carlos.lopez@example.com', direccion: 'Boulevard de los Sueños Rotos 45', estado: 'Inactivo' },
    { id: 4, nombre: 'Laura Martínez', correo: 'laura.martinez@example.com', direccion: 'Plaza Mayor 1', estado: 'Activo' },
    { id: 5, nombre: 'Pedro Sánchez', correo: 'pedro.sanchez@example.com', direccion: 'Camino Real 99', estado: 'Inactivo' },
];

/**
 * @namespace clientApi
 * @description 
 */
export const clientApi = {
    getAll: async (): Promise<IClient[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Fetching all clients (mock)');
                resolve([...clientsData]); 
            }, 500);
        });
    },

   getById: async (id: number): Promise<IClient | undefined> => { 
        return new Promise((resolve) => {
            setTimeout(() => {
                const client = clientsData.find(c => c.id === id);
                resolve(client);
            }, 300);
        });
    },

    create: async (item: Omit<IClient, 'id'>): Promise<IClient> => {
        return new Promise((_, reject) => {
            setTimeout(() => {
                console.warn('Attempted to create a client (operation not allowed)');
                reject(new Error('La creación de clientes no está permitida.'));
            }, 100);
        });
    },

    update: async (item: IClient): Promise<IClient> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = clientsData.findIndex(c => c.id === item.id);
                if (index !== -1) {
                    clientsData[index] = { ...clientsData[index], ...item }; // Merge de datos
                    console.log(`Client updated: ${item.id} (mock)`);
                    resolve(clientsData[index]);
                } else {
                    reject(new Error(`Client with ID ${item.id} not found.`));
                }
            }, 400);
        });
    },

    delete: async (id: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const initialLength = clientsData.length;
                clientsData = clientsData.filter(c => c.id !== id);
                if (clientsData.length < initialLength) {
                    console.log(`Client deleted: ${id} (mock)`);
                    resolve();
                } else {
                    reject(new Error(`Client with ID ${id} not found.`));
                }
            }, 300);
        });
    },
};