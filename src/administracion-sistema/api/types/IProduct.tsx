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
    imageData: Uint8Array; // o simplemente number[] si prefieres
}

export interface ManufacturedArticleDetailDTO {
    articleId: number;  // Usamos number para Long
    quantity: number;   // int también es number en TS
    article: IIngrediente;
}
