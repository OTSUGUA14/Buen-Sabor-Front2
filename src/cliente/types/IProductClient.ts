import type { IArticle } from "../../administracion-sistema/api/types/IArticle";

export interface IProductClient {
    id: number;
    idmanufacturedArticle?: number;
    name: string;
    description: string;
    price: number;
    estimatedTimeMinutes: number;
    manufacturedArticleDetail: any[];
    category: any;
    manufacInventoryImage: { imageData: string };
    isAvailable: boolean;
    isPromo?: boolean;
    saleDetails?: any[];
    productType?: string;
    currentStock?: number;
}

export interface ManufacturedArticleDetail {
    idmanufacturedArticleDetail?: number;
    quantity: number;
    article?: IArticle;
}

export interface InventoryImage {
    imageData: string;
    idinventoryImage?: number;
}
export interface MeasuringUnit {
    idmeasuringUnit: number;
    unit: string;
}

export interface Category {
    idcategory: number;
    forSale: boolean;
    name: string;
}
export interface ManufacturedArticleDetailInput {
    articleId: number;
    quantity: number;
}
