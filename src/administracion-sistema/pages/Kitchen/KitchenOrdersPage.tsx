// src/administracion-sistema/pages/KitchenOrdersPage/KitchenOrdersPage.tsx

import React, { useState, useMemo } from 'react';
import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
import { Button } from '../../components/common/Button/Button';
import { SelectField } from '../../components/common/SelectField/SelectField';
import type { SelectOption as ISelectOption } from '../../components/common/SelectField/SelectField.types'; 
import { InputField } from '../../components/common/InputField/InputField';

import '../crud-pages.css';
import './KitchenOrdersPge.css';

interface IDummyKitchenOrder {
    id: number;
    horaPedido: string;
    estado: 'PENDIENTE' | 'EN PREPARACION' | 'LISTO PARA ENTREGAR' | 'CANCELADO';
    detallesProductos: string;
    tipoEntrega: 'DELIVERY' | 'LOCAL';
    notasCocina?: string;
}

export const KitchenOrdersPage: React.FC = () => {
    const dummyKitchenOrders: IDummyKitchenOrder[] = useMemo(() => [
        { id: 1001, horaPedido: '17:00', estado: 'EN PREPARACION', detallesProductos: 'Hamburguesa clásica (2), Papas fritas (1)', tipoEntrega: 'DELIVERY' },
        { id: 1002, horaPedido: '17:05', estado: 'PENDIENTE', detallesProductos: 'Pizza Muzzarella (1), Coca cola 500ml (1)', tipoEntrega: 'LOCAL', notasCocina: 'Extra queso' },
        { id: 1003, horaPedido: '16:45', estado: 'LISTO PARA ENTREGAR', detallesProductos: 'Ensalada Caesar (1)', tipoEntrega: 'DELIVERY' },
        { id: 1004, horaPedido: '17:10', estado: 'PENDIENTE', detallesProductos: 'Lomo completo (1), Cerveza (1)', tipoEntrega: 'LOCAL' },
        { id: 1005, horaPedido: '16:00', estado: 'CANCELADO', detallesProductos: 'Tacos de carne (3)', tipoEntrega: 'DELIVERY' },
        { id: 1006, horaPedido: '17:15', estado: 'PENDIENTE', detallesProductos: 'Sándwich de pollo (1), Jugo de naranja (1)', tipoEntrega: 'LOCAL' },
        { id: 1007, horaPedido: '17:20', estado: 'PENDIENTE', detallesProductos: 'Sushi variado (1)', tipoEntrega: 'DELIVERY' },
    ], []);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('TODOS');
    const [priorityFilter, setPriorityFilter] = useState<string>('TODOS');

    const kitchenStatusOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'PENDIENTE', label: 'PENDIENTE' },
        { value: 'EN PREPARACION', label: 'EN PREPARACIÓN' },
        { value: 'LISTO PARA ENTREGAR', label: 'LISTO PARA ENTREGAR' },
        { value: 'CANCELADO', label: 'CANCELADO' },
    ], []);

    const priorityOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'ALTA', label: 'ALTA' },
        { value: 'NORMAL', label: 'NORMAL' },
    ], []);


    const kitchenOrderColumns: ITableColumn<IDummyKitchenOrder>[] = useMemo(() => [
        { id: 'id', label: 'Nro Orden', numeric: true },
        { id: 'horaPedido', label: 'Hora Pedido' },

        { id: 'estado', label: 'Estado' },
        { id: 'detallesProductos', label: 'Productos a Preparar' },
        { id: 'tipoEntrega', label: 'Entrega' },
        {
            id: 'acciones',
            label: 'Acciones',
            render: (item) => (
                <div className="table-actions">
                    {item.estado === 'PENDIENTE' && (
                        <Button
                            variant="primary"
                            size="small"
                            onClick={() => console.log('Iniciar preparación de:', item.id)}
                        >
                            Iniciar Preparación
                        </Button>
                    )}
                    {item.estado === 'EN PREPARACION' && (
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => console.log('Marcar como listo:', item.id)}
                        >
                            Marcar como Listo
                        </Button>
                    )}
                    <Button
                        variant="outline-info"
                        size="small"
                        onClick={() => console.log('Ver detalles completos de:', item.id)}
                    >
                        Ver Detalles
                    </Button>
                </div>
            ),
        },
    ], []);

    return (
        <div className="crud-page-container">
            <div className="page-header">
                <h2>Órdenes en Cocina</h2>
            </div>

            <div className="filter-controls">
                <InputField
                    name="searchOrdersKitchen"
                    type="search"
                    placeholder="Buscar por Nro Orden, Producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <SelectField
                    name="statusFilterKitchen"
                    label="Filtrar por Estado"
                    options={kitchenStatusOptions}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="status-select"
                />
            </div>

            <GenericTable
                data={dummyKitchenOrders}
                columns={kitchenOrderColumns}
            />


            {/* Placeholder para un modal de detalles de la orden para cocina */}
            {/*
            <FormModal
                isOpen={false}
                onClose={() => {}}
                title="Detalles de la Orden para Cocina"
            >
                <div>Contenido con todos los detalles de los productos, alérgenos, etc.</div>
            </FormModal>
            */}

        </div>
    );
};