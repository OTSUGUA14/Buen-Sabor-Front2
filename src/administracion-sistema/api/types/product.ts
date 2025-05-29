// src/administracion-sistema/api/types/product.ts

export interface IProduct {
    id: number;
    nombre: string;
    rubro: string;
    ingredientes: { id: number; nombre: string; }[]; // ¡¡¡IMPORTANTE: ARRAY DE OBJETOS!!!
    precioVenta: number;
    ofertaPorcentaje: number;
    stock: number;
    estado: 'Activo' | 'Inactivo';
}