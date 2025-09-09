// src/administracion-sistema/api/employee.ts

import type { IEmployee } from "./types/IEmployee";

export const employeeApi = {
    getAll: async (): Promise<IEmployee[]> => {
        const res = await fetch('http://localhost:8080/employee/getAll');
        if (!res.ok) throw new Error('Error al obtener empleados');
        return res.json(); // El backend ya devuelve enabled
    },

    getById: async (id: number): Promise<IEmployee> => {
        const res = await fetch(`http://localhost:8080/employee/get/${id}`);
        if (!res.ok) throw new Error(`Error al obtener empleado con ID ${id}`);
        return res.json(); // El backend ya devuelve enabled
    },

    create: async (employee: Omit<IEmployee, 'id'>): Promise<IEmployee> => {
        const employeeToSend = {
            firstName: employee.name,
            lastName: employee.lastName,
            phoneNumber: employee.phoneNumber,
            email: employee.email,
            birthDate: new Date(employee.birthDate).toISOString(),
            domiciles: [],
            username: employee.username,
            password: employee.password,
            role: employee.employeeRole,
            salary: employee.salary,
            shift: employee.shift,
            enabled: employee.enabled ?? true, // <-- Nuevo campo
        };

        const res = await fetch('http://localhost:8080/employee/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeToSend),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Error al crear empleado: ${errorText}`);
        }
        return res.json();
    },

    update: async (employee: IEmployee): Promise<IEmployee> => {
        const { id, ...rest } = employee;
        const updateData = {
            firstName: rest.name,
            lastName: rest.lastName,
            phoneNumber: rest.phoneNumber,
            email: rest.email,
            birthDate: new Date(rest.birthDate).toISOString(),
            username: rest.username,
            password: rest.password,
            role: rest.employeeRole,
            salary: rest.salary,
            shift: rest.shift,
            enabled: rest.enabled ?? true, // <-- Nuevo campo
        };

        const res = await fetch(`http://localhost:8080/employee/update/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Error al actualizar empleado: ${errorText}`);
        }
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`http://localhost:8080/employee/delete/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar empleado');
    },
};
