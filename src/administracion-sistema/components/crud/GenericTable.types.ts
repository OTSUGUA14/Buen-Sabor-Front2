
export interface ITableColumn<T> {
  id: keyof T | 'acciones'; 
  label: string;
  numeric?: boolean;
  disablePadding?: boolean;
  render?: (item: T) => React.ReactNode; // Para renderizado personalizado
}

export interface IGenericTableProps<T extends { id: number }> {
  data: T[];
  columns: ITableColumn<T>[];
  handleEdit?: (item: T) => void;      
  handleDelete?: (id: number) => void; 
}