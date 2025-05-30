// src/administracion-sistema/api/types/IEmployee.ts

/**
 * @interface IEmployee
 * @description Interfaz que define la estructura de un empleado en el sistema.
 */
export interface IEmployee {
    id: number;
    nombre: string;
    correo: string;
    direccion: string;
    estado: 'Activo' | 'Inactivo'; // Estado del empleado: 'Activo' o 'Inactivo'
    rol: 'Cajero' | 'Cocinero' | 'Repartidor' | 'Admin'; // Rol del empleado
}