import type { IIngrediente } from "./IIngrediente";


export interface IProduct {
    id: number;
    name: string;
    description: string;
    manufacturedArticleDetail: ManufacturedArticleDetailDTO[];
    price: number;
    stock: number;
    isAvailable: boolean;
    estimatedTimeMinutes: number;
    inventoryImageDTO?: InventoryImageDTO

}
interface InventoryImageDTO {
    id: number;
    imageData: Uint8Array; 
}

export interface ManufacturedArticleDetailDTO {
    articleId: number;
    quantity: number;   
    article: IIngrediente;
}
