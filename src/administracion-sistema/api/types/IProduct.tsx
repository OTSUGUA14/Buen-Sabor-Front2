export interface IIngrediente {
    id: number;
    nombre: string;
    cantidad?: number; // opcional si no siempre existe
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