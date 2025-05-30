/**
 * @interface ISupply
 * @description 
 */

export interface ISupply {
    id: number;
    nombre: string;
    unidadMedida: string;
    costo: number;
    categoria: string;
    subCategoria: string;
    stockActual: number; 
    stockMinimo: number; 
    estado: 'Activo' | 'Inactivo'; 
}