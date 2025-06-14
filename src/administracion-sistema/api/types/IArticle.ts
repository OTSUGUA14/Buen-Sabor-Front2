export interface IArticle  {
    id: number; 
    idarticle: number;
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
}