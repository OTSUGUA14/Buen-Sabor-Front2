// src/administracion-sistema/api/types/ISupply.ts
export interface Ingrediente {
    denomination: string;
    currentStock: number;
    maxStock: number;
    buyingPrice: number;
    measuringUnit: {
        unit: string;
        idmeasuringUnit: number;
    };
    category: {
        name: string;
        idcategory: number;
    };
    idarticle: number;
}
