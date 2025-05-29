// src/administracion-sistema/api/types/supply.ts

export interface ISupply {
    id: number;
    nombre: string;
    unidadMedida: string;
    stockActual: number;
    stockMinimo: number;
    costo: number;
    // Añade esta línea:
    esInsumo: boolean;
}