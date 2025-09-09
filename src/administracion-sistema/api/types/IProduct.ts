import type { IArticle } from "./IArticle";

export interface IProduct {
    id: number;
    idmanufacturedArticle?: number;
    name: string;
    description: string;
    price: number;
    estimatedTimeMinutes: number;
    manufacturedArticleDetail: ManufacturedArticleDetail[];
    category: Category;
    manufacInventoryImage
    : InventoryImage;
    isAvailable: boolean;
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
    name: string;
    forSale: boolean;
    enabled: boolean; 
}
export interface ManufacturedArticleDetailInput {
    articleId: number;
    quantity: number;
}
