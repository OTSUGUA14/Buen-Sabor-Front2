// src/administracion-sistema/components/crud/GenericTable/GenericTable.tsx

import React, { useState, useEffect } from "react";
// Añade 'type' antes de { IGenericTableProps, ITableColumn }
import type { IGenericTableProps, ITableColumn } from "./GenericTable.types";
import { Button } from "../../common/Button/Button"; // Importamos nuestro Button
import './GenericTable.css'; // Estilos para la tabla

// Para los íconos, puedes usar SVGs inline, clases de fuentes de íconos (Font Awesome, etc.)
// o simplemente el texto "Editar" y "Eliminar". Para este ejemplo, usaremos texto.
// Si deseas iconos, tendrías que incluir una librería de iconos o usar SVGs.

export const GenericTable = <T extends { id: number }>({
    data,
    columns,
    handleEdit,
    handleDelete,
}: IGenericTableProps<T>) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState<T[]>([]); // El estado interno para la paginación

    // Actualizar las filas cuando cambien los datos pasados por prop
    useEffect(() => {
        setRows(data);
        setPage(0); // Resetear la página al cambiar los datos
    }, [data]);

    // Función para cambiar de página
    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    // Función para cambiar el número de filas por página
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLSelectElement> // El select de rowsPerPage cambia el evento
    ) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };

    const totalPages = Math.ceil(rows.length / rowsPerPage);

    return (
        <div className="generic-table-wrapper">
            <div className="generic-table-container">
                <table className="generic-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={String(column.id)}
                                    className={column.numeric ? "numeric" : ""}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <tr key={row.id}>
                                        {columns.map((column) => {
                                            return (
                                                <td
                                                    key={String(column.id)}
                                                    className={column.numeric ? "numeric" : ""}
                                                >
                                                    {column.render ? (
                                                        column.render(row)
                                                    ) : column.id === "acciones" ? (
                                                        <div className="actions-cell">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="small"
                                                                onClick={() => handleEdit(row)}
                                                            >
                                                                {/* Puedes poner un SVG de un lapiz aquí si quieres iconos */}
                                                                Editar
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="small"
                                                                onClick={() => handleDelete(row.id)}
                                                            >
                                                                {/* Puedes poner un SVG de un tacho de basura aquí si quieres iconos */}
                                                                Eliminar
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        // Accede a la propiedad del objeto dinámicamente
                                                        (row as any)[column.id]
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                                    No hay datos para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="pagination-controls">
                <span>Filas por página:</span>
                <select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={100}>100</option>
                </select>
                <span>
                    {page * rowsPerPage + 1}-
                    {Math.min((page + 1) * rowsPerPage, rows.length)} de {rows.length}
                </span>
                <Button
                    onClick={() => handleChangePage(page - 1)}
                    disabled={page === 0}
                    variant="secondary"
                    size="small"
                >
                    Anterior
                </Button>
                <Button
                    onClick={() => handleChangePage(page + 1)}
                    disabled={page >= totalPages - 1}
                    variant="secondary"
                    size="small"
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
};