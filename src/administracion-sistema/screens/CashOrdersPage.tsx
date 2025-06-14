
import { useState, useMemo } from 'react';
import { GenericTable } from '../components/crud/GenericTable';
import type { ITableColumn } from '../components/crud/GenericTable.types';
import { Button } from '../components/common/Button';
import { SelectField } from '../components/common/SelectField';
import type { ISelectOption } from '../components/crud/GenericForm.types'; 
import { InputField } from '../components/common/InputField'; 

import '../../pages/crud-pages.css';
import './CashOrdersPage.css'; 

interface IDummyOrder {
    id: number;
    cliente: string;
    fecha: string; 
    hora: string;
    total: number;
    estado: 'PENDIENTE' | 'EN COCINA' | 'LISTO PARA ENTREGAR' | 'EN CAMINO' | 'ENTREGADO' | 'CANCELADO';
    tipoEntrega: 'DELIVERY' | 'LOCAL';
}

export const OrdersPage: React.FC = () => {
    const dummyOrders: IDummyOrder[] = useMemo(() => [
        { id: 1001, cliente: 'Juan Pérez', fecha: '2025-06-05', hora: '14:00', total: 1500.50, estado: 'PENDIENTE', tipoEntrega: 'DELIVERY' },
        { id: 1002, cliente: 'Ana Gómez', fecha: '2025-06-05', hora: '13:45', total: 800.00, estado: 'EN COCINA', tipoEntrega: 'LOCAL' },
        { id: 1003, cliente: 'Pedro López', fecha: '2025-06-04', hora: '18:15', total: 2200.75, estado: 'LISTO PARA ENTREGAR', tipoEntrega: 'DELIVERY' },
        { id: 1004, cliente: 'María Rodríguez', fecha: '2025-06-04', hora: '17:30', total: 1250.00, estado: 'ENTREGADO', tipoEntrega: 'LOCAL' },
        { id: 1005, cliente: 'Luis García', fecha: '2025-06-03', hora: '11:00', total: 950.25, estado: 'CANCELADO', tipoEntrega: 'DELIVERY' },
        { id: 1006, cliente: 'Sofía Martínez', fecha: '2025-06-05', hora: '14:10', total: 1800.00, estado: 'PENDIENTE', tipoEntrega: 'DELIVERY' },
        { id: 1007, cliente: 'Carlos Sánchez', fecha: '2025-06-05', hora: '14:05', total: 650.00, estado: 'EN COCINA', tipoEntrega: 'LOCAL' },
        { id: 1008, cliente: 'Laura Díaz', fecha: '2025-06-04', hora: '19:00', total: 3000.00, estado: 'EN CAMINO', tipoEntrega: 'DELIVERY' },
        { id: 1009, cliente: 'Diego Morales', fecha: '2025-06-04', hora: '16:00', total: 720.00, estado: 'ENTREGADO', tipoEntrega: 'LOCAL' },
        { id: 1010, cliente: 'Elena Torres', fecha: '2025-06-03', hora: '12:30', total: 1100.00, estado: 'PENDIENTE', tipoEntrega: 'DELIVERY' },
        { id: 1011, cliente: 'Martín Blanco', fecha: '2025-06-05', hora: '15:00', total: 1950.00, estado: 'PENDIENTE', tipoEntrega: 'DELIVERY' },
        { id: 1012, cliente: 'Paula Castro', fecha: '2025-06-05', hora: '14:30', total: 900.00, estado: 'EN COCINA', tipoEntrega: 'LOCAL' },
    ], []);

    // Estados para los filtros (solo para la estructura, sin lógica de filtrado por ahora)
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('TODOS');
    const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<string>('TODOS');

    // Opciones para el filtro de estado (poner los que tenga en martin en el back)
    const statusOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'PENDIENTE', label: 'PENDIENTE' },
        { value: 'EN COCINA', label: 'EN COCINA' },
        { value: 'LISTO PARA ENTREGAR', label: 'LISTO PARA ENTREGAR' },
        { value: 'EN CAMINO', label: 'EN CAMINO' },
        { value: 'ENTREGADO', label: 'ENTREGADO' },
        { value: 'CANCELADO', label: 'CANCELADO' },
    ], []);

    // Opciones para el filtro de tipo de entrega
    const deliveryTypeOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'DELIVERY', label: 'DELIVERY' },
        { value: 'LOCAL', label: 'LOCAL' },
    ], []);

    // Definición de las columnas de la tabla (cambiar IDummyOrder por la interfaz de las ordenes cuando haya una (decirle al martin que la agregue))
    const orderColumns: ITableColumn<IDummyOrder>[] = useMemo(() => [
        { id: 'id', label: 'ID Orden', numeric: true },
        { id: 'cliente', label: 'Cliente' },
        { id: 'fecha', label: 'Fecha' },
        { id: 'hora', label: 'Hora' },
        { id: 'total', label: 'Total', numeric: true, render: (item) => `$${item.total.toFixed(2)}` },
        { id: 'estado', label: 'Estado' },
        { id: 'tipoEntrega', label: 'Tipo Entrega' },
        {
            id: 'acciones',
            label: 'Acciones',
            render: (item) => (
                <div className="table-actions">
                    {/* El botón "Ver Detalles" podría abrir un modal con el detalle de la orden */}
                    <Button variant="outline-primary" size="small" onClick={() => console.log('Ver detalles de:', item.id)}>
                        Ver Detalles
                    </Button>
                    {/* Un botón para cambiar el estado, quizás solo para estados "activos" */}
                    {item.estado === 'PENDIENTE' && (
                        <Button variant="primary" size="small" onClick={() => console.log('Cambiar estado de:', item.id)}>
                            Aceptar Orden
                        </Button>
                    )}
                    {item.estado === 'EN COCINA' && (
                        <Button variant="secondary" size="small" onClick={() => console.log('Cambiar estado de:', item.id)}>
                            Lista p/ Entregar
                        </Button>
                    )}
                </div>
            ),
        },
    ], []);

    return (
        <div className="crud-page-container"> 
            <div className="page-header">
                <h2>Gestión de Órdenes</h2>
            </div>

            <div className="filter-controls">
                <InputField
                    name="searchOrders"
                    type="search"
                    placeholder="Buscar por ID, Cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <SelectField
                    name="statusFilterOrders"
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="status-select"
                />
            </div>

            <GenericTable
                data={dummyOrders} 
                columns={orderColumns}
                
            />

            {/* Agregar el modal para ver los detalles o cambiar de estados*/}
            
        </div>
    );
};