import type { IArticle } from './IArticle';
import { type IProduct } from './IProduct';

export enum SaleType {
    HAPPYHOUR = "HAPPYHOUR",
    SPRINGSALE = "SPRINGSALE",
    SUMMERSALE = "SUMMERSALE",
    WINTERSALE = "WINTERSALE",
    FALLSALE = "FALLSALE",
    CHRISTMASSALE = "CHRISTMASSALE"
}

export interface InventoryImage {
    IDInventoryImage: number;
    imageData: string;
}

export interface ISale {
    id: number;
    idsale: number;
    denomination: string;
    startDate: string; 
    endDate: string; 
    startTime: string; 
    endTime: string; 
    saleDescription: string;
    salePrice: number;
    saleType: SaleType;
    active: boolean;
    saleDiscount: number; 
    inventoryImage: InventoryImage;
    saleDetails: ISaleDetail[];
    quantity?:number
}

export interface ISaleDetail {
    IDSaleDetail: number;
    quantity: number;
    article?: IArticle | null;
    manufacturedArticle?: IProduct | null;
}