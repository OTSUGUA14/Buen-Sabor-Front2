// src/administracion-sistema/components/crud/GenericTable/GenericTable.tsx

import React, { useState, useEffect } from "react";
import type { IGenericTableProps, ITableColumn } from "./GenericTable.types";
import { Button } from "../../common/Button/Button";
import './GenericTable.css';

export const GenericTable = <T extends { id: number }>({
    data,
    columns,
    handleEdit, // <-- Ahora son opcionales
    handleDelete, // <-- Ahora son opcionales
}: IGenericTableProps<T>) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState<T[]>([]);

    useEffect(() => {
        setRows(data);
        setPage(0);
    }, [data]);

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };

    const totalPages = Math.ceil(rows.length / rowsPerPage);

    // Determinar si hay alguna columna de "acciones" definida por el usuario
    const hasActionsColumn = columns.some(column => column.id === 'acciones');

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
                            {/* NOTA: No añadimos una columna de "Acciones" aquí. 
                                Se espera que el consumidor la incluya en 'columns' si la necesita. */}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                {/* colSpan debe ser el número de columnas que se le pasaron */}
                                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                                    No hay datos para mostrar.
                                </td>
                            </tr>
                        ) : (
                            rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
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
                                                        // Renderiza los botones de acción si la columna es 'acciones'
                                                        <div className="actions-cell">
                                                            {handleEdit && ( // <-- Botón Editar condicional
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="small"
                                                                    onClick={() => handleEdit(row)}
                                                                >
                                                                    Editar
                                                                </Button>
                                                            )}
                                                            {handleDelete && ( // <-- Botón Eliminar condicional
                                                                <Button
                                                                    variant="outline-danger" // <-- Usando variant="outline-danger"
                                                                    size="small"
                                                                    onClick={() => handleDelete(row.id)}
                                                                >
                                                                    Eliminar
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        // Accede a la propiedad del objeto dinámicamente
                                                        (row as any)[column.id]
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>

            {rows.length > 0 && (
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
            )}
        </div>
    );
};