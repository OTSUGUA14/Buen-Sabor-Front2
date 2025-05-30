export interface IIngrediente {
    id: number;
    nombre: string;
}

export interface IProduct {
    id: number;
    nombre: string;
    descripcion: string; 
    rubro: 'Hamburguesa' | 'Pizza' | 'Empanadas' | 'Postre ' | 'Bebida' | 'Ensalada';
    ingredientes: IIngrediente[]; 
    precioVenta: number;
    ofertaPorcentaje: number; 
    stock: number;
    estado: 'Activo' | 'Inactivo';
}