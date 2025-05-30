/**
 * @interface IClient
 * @description 
 */

export interface IClient {
    id: number;
    nombre: string;
    correo: string;
    direccion: string;
    estado: 'Activo' | 'Inactivo'; 
}