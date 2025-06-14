// src/administracion-sistema/api/types/ISale.ts

export interface ISale {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    saleDate: string; 
}

export interface IProductStatsRow {
    id: number; 
    productName: string;
    description: string;
    totalQuantitySold: number;
    totalRevenue: number;
}