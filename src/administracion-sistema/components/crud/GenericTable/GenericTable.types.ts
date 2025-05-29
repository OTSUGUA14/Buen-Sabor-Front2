// src/administracion-sistema/components/crud/GenericTable/GenericTable.types.ts

import React from 'react';

// Interfaz para cada columna de la tabla
export interface ITableColumn<T> {
  id: keyof T | 'acciones'; // Clave que corresponde a la propiedad del objeto en los datos, o 'acciones' para la columna de acciones
  label: string; // Etiqueta visible de la columna
  numeric?: boolean; // Si es una columna numérica (para alineación)
  // No necesitamos disablePadding si no usamos MUI
  render?: (item: T) => React.ReactNode; // Función opcional para personalizar la renderización del contenido de la celda
}

// Interfaz para las props de la TableGeneric
export interface IGenericTableProps<T> {
  data: T[]; // Los datos que la tabla mostrará (viene de la página padre)
  columns: ITableColumn<T>[]; // Definición de las columnas
  handleEdit: (item: T) => void; // Función para manejar la edición de un elemento
  handleDelete: (id: number) => void; // Función para manejar la eliminación de un elemento
}