export interface IIngrediente {
    id: number; 
    idArticulo: number;
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
    estado: 'Activo' | 'Inactivo';
}