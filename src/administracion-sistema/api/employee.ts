// src/administracion-sistema/api/employee.ts

import type { IEmployee } from './types/IEmployee';

let employeesData: IEmployee[] = [
    { id: 101, nombre: 'Ana Gómez', correo: 'ana.gomez@example.com', direccion: 'Calle del Sol 1', estado: 'Activo', rol: 'Admin' },
    { id: 102, nombre: 'Roberto Fernández', correo: 'roberto.f@example.com', direccion: 'Av. Luna 50', estado: 'Activo', rol: 'Cocinero' },
    { id: 103, nombre: 'Sofía Díaz', correo: 'sofia.d@example.com', direccion: 'Paseo de las Flores 22', estado: 'Activo', rol: 'Cajero' },
    { id: 104, nombre: 'Luis Torres', correo: 'luis.t@example.com', direccion: 'Ruta 40 Km 10', estado: 'Inactivo', rol: 'Repartidor' },
    { id: 105, nombre: 'Marta Ríos', correo: 'marta.r@example.com', direccion: 'Barrio Norte 7', estado: 'Activo', rol: 'Cajero' },
];

export const employeeApi = {
    getAll: async (): Promise<IEmployee[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...employeesData]);
            }, 500);
        });
    },

    getById: async (id: number): Promise<IEmployee | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const employee = employeesData.find(e => e.id === id);
                resolve(employee);
            }, 300);
        });
    },

    create: async (item: Omit<IEmployee, 'id'>): Promise<IEmployee> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newEmployee: IEmployee = {
                    id: Math.floor(Math.random() * 1000000), 
                    ...item,
                };
                employeesData.push(newEmployee);
                resolve(newEmployee);
            }, 400);
        });
    },

    update: async (item: IEmployee): Promise<IEmployee> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = employeesData.findIndex(e => e.id === item.id);
                if (index !== -1) {
                    employeesData[index] = { ...employeesData[index], ...item };
                    resolve(employeesData[index]);
                } else {
                    reject(new Error(`Employee with ID ${item.id} not found.`));
                }
            }, 400);
        });
    },

    delete: async (id: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const initialLength = employeesData.length;
                employeesData = employeesData.filter(e => e.id !== id);
                if (employeesData.length < initialLength) {
                    resolve();
                } else {
                    reject(new Error(`Employee with ID ${id} not found.`));
                }
            }, 300);
        });
    },
};