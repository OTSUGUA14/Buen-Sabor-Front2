// src/administracion-sistema/api/employee.ts

import type { IEmployee } from "./types/IEmployee";

export const employeeApi = {
    getAll: async (): Promise<IEmployee[]> => {
        const res = await fetch('http://localhost:8080/employee/getAll');
        if (!res.ok) throw new Error('Error al obtener empleados');
        return res.json();
    },

    getById: async (id: number): Promise<IEmployee> => {
        const res = await fetch(`http://localhost:8080/employee/get/${id}`);
        if (!res.ok) throw new Error(`Error al obtener empleado con ID ${id}`);
        return res.json();
    },

    create: async (employee: Omit<IEmployee, 'id'>): Promise<IEmployee> => {
        // Mapear campos del frontend al DTO del backend
        const employeeToSend = {
            firstName: employee.name,        // name -> firstName
            lastName: employee.lastName,
            phoneNumber: employee.phoneNumber,
            email: employee.email,
            birthDate: new Date(employee.birthDate).toISOString(), // Convertir a ISO string
            domiciles: [],                   // Array vacío como requiere el DTO
            username: employee.username,
            password: employee.password,
            role: employee.employeeRole,     // employeeRole -> role
            salary: employee.salary,
            shift: employee.shift,
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
        
        // Mapear campos para la actualización si es necesario
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
