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

    create: async (employee: Omit<IEmployee, 'id' | 'domiciles'>): Promise<IEmployee> => {
        const res = await fetch('http://localhost:8080/employee/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee),
        });
        if (!res.ok) throw new Error('Error al crear empleado');
        return res.json();
    },

    update: async (employee: IEmployee): Promise<IEmployee> => {
        const { id, ...rest } = employee;
        const res = await fetch(`http://localhost:8080/employee/update/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rest),
        });
        if (!res.ok) throw new Error('Error al actualizar empleado');
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`http://localhost:8080/employee/delete/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar empleado');
    },
};
