export interface IArticle {
    id: number;
    idarticle?: number;
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
    inventoryImage?: {
        IDInventoryImage: number;
        imageData: string;
    } | null;
    quantity?: number;
    forSale: boolean;
    enabled: boolean; 
}