// src/administracion-sistema/api/types/IEmployee.ts

export type Role = 'ADMIN' | 'CASHIER' | 'CHEF' | 'DRIVER';
export type Shift = 'MORNING' | 'EVENING' | 'NIGHT';

export interface IEmployee {
    id: number;
    name: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    birthDate: string;
    employeeRole: Role;
    salary: number;
    shift: Shift;
    username: string;
    password: string;
    domiciles: any[];
    enabled: boolean; 
}
