import type { IIngrediente } from "../administracion-sistema/api/types/IIngrediente";

export interface IProductClient {
    id: number;
    name: string;
    description: string;
    manufacturedArticleDetail: ManufacturedArticleDetailDTO[];
    price: number;
    stock: number;
    isAvailable: boolean;
    estimatedTimeMinutes: number;
    inventoryImageDTO?: InventoryImageDTO
    category: string; // <-- Agregado para categorizar
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
