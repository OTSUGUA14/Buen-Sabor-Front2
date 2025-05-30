export interface Ingrediente {
    id: number;           // <-- aquí
    idArticulo: number;
    nombre: string;
    stockActual: number;
    stockMaximo: number;
    precioCompra: number;
    unidadMedicion: { unidad: string; idUnidadMedicion: number };
    categoria: { nombreCategoria: string; idCategoria: number };
    estado: 'Activo' | 'Inactivo';
}
