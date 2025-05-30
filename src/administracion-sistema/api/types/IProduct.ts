// src/administracion-sistema/api/types/IProduct.ts

export interface IIngrediente {
    id: number;
    nombre: string;
}

/**
 * @interface IProduct
 * @description Interfaz que define la estructura de un producto en el sistema.
 */
export interface IProduct {
    id: number;
    nombre: string;
    descripcion: string; // <-- NUEVA PROPIEDAD AÑADIDA
    rubro: string; // Ej: 'Hamburguesa', 'Pizza', 'Bebida'
    ingredientes: IIngrediente[]; // Array de ingredientes
    precioVenta: number;
    ofertaPorcentaje: number; // Porcentaje de descuento si aplica
    stock: number;
    estado: 'Activo' | 'Inactivo';
}