// src/administracion-sistema/api/types/ISupply.ts

export interface ISupply {
    id: number;
    nombre: string;
    unidadMedida: string;
    stockActual: number;
    stockMinimo: number;
    costo: number;
    categoria: 'Proteinas' | 'Vegetales' | 'Lacteos' | 'Panificados'; 
    subCategoria: string; 
    estado: 'Activo' | 'Inactivo';
}