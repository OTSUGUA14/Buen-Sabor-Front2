import type { IArticle } from "../../administracion-sistema/api/types/IArticle";
import type { ISaleDetail } from "../../administracion-sistema/api/types/ISale";

export interface IProductClient {
    id: number;
    idmanufacturedArticle?: number;
    name: string;
    description: string;
    price: number;
    estimatedTimeMinutes: number;
    manufacturedArticleDetail: ManufacturedArticleDetail[];
    category: Category;
    manufacInventoryImage: InventoryImage;
    isAvailable: boolean;
    productType?: 'manufactured' | 'supply' | 'promo';
    isPromo?: boolean;
    saleDetails?: ISaleDetail[];
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
