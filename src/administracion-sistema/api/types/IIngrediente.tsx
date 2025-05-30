export interface Ingrediente {
    id: number; // Usa el mismo nombre de la API
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