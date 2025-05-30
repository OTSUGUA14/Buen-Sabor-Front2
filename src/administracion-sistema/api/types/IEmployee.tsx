
/**
 * @interface IEmployee
 * @description 
 */
export interface IEmployee {
    id: number;
    nombre: string;
    correo: string;
    direccion: string;
    estado: 'Activo' | 'Inactivo'; 
    rol: 'Cajero' | 'Cocinero' | 'Repartidor' | 'Admin'; 
}