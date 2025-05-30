/**
 * @interface IClient
 * @description Interfaz que define la estructura de un cliente en el sistema.
 */

export interface IClient {
    id: number;
    nombre: string;
    correo: string;
    direccion: string;
    estado: 'Activo' | 'Inactivo'; // Estado del cliente: 'Activo' o 'Inactivo'
}