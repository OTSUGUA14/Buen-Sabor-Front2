// src/administracion-sistema/pages/DeliveryOrdersPage/DeliveryOrdersPage.tsx

import { useState, useMemo } from 'react';
import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
import { Button } from '../../components/common/Button/Button';
import { SelectField } from '../../components/common/SelectField/SelectField';
import type { SelectOption as ISelectOption } from '../../components/common/SelectField/SelectField.types';
import { InputField } from '../../components/common/InputField/InputField';

import '../crud-pages.css';
import './DeliveryOrdersPage.css'; 

interface IDummyDeliveryOrder {
    id: number; 
    cliente: string;
    telefonoCliente: string; 
    direccionEntrega: string; 
    total: number;
    estado: 'LISTO PARA ENTREGAR' | 'EN CAMINO' | 'ENTREGADO' | 'CANCELADO'; 
    horaEstimadaEntrega?: string;
    notasDelivery?: string; 
}

export const DeliveryOrdersPage: React.FC = () => {
    const dummyDeliveryOrders: IDummyDeliveryOrder[] = useMemo(() => [
        { id: 2001, cliente: 'Martín Suárez', telefonoCliente: '1123456789', direccionEntrega: 'Av. San Martín 1234', total: 1500.50, estado: 'LISTO PARA ENTREGAR', horaEstimadaEntrega: '18:30' },
        { id: 2002, cliente: 'Sofía Giménez', telefonoCliente: '2615551234', direccionEntrega: 'Calle Falsa 123', total: 800.00, estado: 'EN CAMINO', horaEstimadaEntrega: '18:15' },
        { id: 2003, cliente: 'Andrés Castro', telefonoCliente: '1198765432', direccionEntrega: 'Las Heras 567, Dpto 3', total: 2200.75, estado: 'LISTO PARA ENTREGAR' },
        { id: 2004, cliente: 'Valeria López', telefonoCliente: '2617778899', direccionEntrega: 'Ruta 40 Km 10, Luján', total: 1250.00, estado: 'ENTREGADO' },
        { id: 2005, cliente: 'Gonzalo Pérez', telefonoCliente: '1133344455', direccionEntrega: 'San Juan 789, Torre A', total: 950.25, estado: 'LISTO PARA ENTREGAR', notasDelivery: 'Dejar en conserjería' },
    ], []);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('LISTO PARA ENTREGAR'); 
    const [timeFilter, setTimeFilter] = useState<string>('TODOS'); 

    const deliveryStatusOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'LISTO PARA ENTREGAR', label: 'LISTO PARA ENTREGAR' },
        { value: 'EN CAMINO', label: 'EN CAMINO' },
        { value: 'ENTREGADO', label: 'ENTREGADO' },
        { value: 'CANCELADO', label: 'CANCELADO' },
    ], []);

    const timeFilterOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'PROXIMAS_20MIN', label: 'Próximas 20 min' },
        { value: 'PENDIENTES_VIEJAS', label: 'Órdenes Antiguas' },
    ], []);

    const deliveryOrderColumns: ITableColumn<IDummyDeliveryOrder>[] = useMemo(() => [
        { id: 'id', label: 'Nro Orden', numeric: true },
        { id: 'cliente', label: 'Cliente' },
        { id: 'direccionEntrega', label: 'Dirección' },
        { id: 'telefonoCliente', label: 'Teléfono' }, 
        { id: 'total', label: 'Total', numeric: true, render: (item) => `$${item.total.toFixed(2)}` },
        { id: 'estado', label: 'Estado' },
        {
            id: 'acciones',
            label: 'Acciones',
            render: (item) => (
                <div className="table-actions">
                    {item.estado === 'LISTO PARA ENTREGAR' && (
                        <Button
                            variant="primary"
                            size="small"
                            onClick={() => console.log('Marcar En Camino:', item.id)}
                        >
                            En Camino
                        </Button>
                    )}
                    {item.estado === 'EN CAMINO' && (
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => console.log('Marcar Entregado:', item.id)}
                        >
                            Entregado
                        </Button>
                    )}
                                        
                </div>
            ),
        },
    ], []);

    return (
        <div className="crud-page-container">
            <div className="page-header">
                <h2>Órdenes para Delivery</h2>
            </div>

            <div className="filter-controls">
                <InputField
                    name="searchOrdersDelivery"
                    type="search"
                    placeholder="Buscar por Orden, Cliente, Dirección..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <SelectField
                    name="statusFilterDelivery"
                    label="Filtrar por Estado"
                    options={deliveryStatusOptions}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="status-select"
                />

            </div>

            <GenericTable
                data={dummyDeliveryOrders}
                columns={deliveryOrderColumns}
            />

            {/* Placeholder para un modal de detalles o confirmación si es necesario */}
            {/*
            <FormModal
                isOpen={false}
                onClose={() => {}}
                title="Detalles de la Entrega"
            >
                <div>Confirmación de entrega, firmas, etc.</div>
            </FormModal>
            */}
        </div>
    );
};