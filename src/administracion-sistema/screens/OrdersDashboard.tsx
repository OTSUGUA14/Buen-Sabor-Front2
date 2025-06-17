import { useEffect, useMemo, useState } from 'react';
import { GenericTable } from '../components/crud/GenericTable';
import type { ITableColumn } from '../components/crud/GenericTable.types';
import { Button } from '../components/common/Button';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';
import type { ISelectOption } from '../components/crud/GenericForm.types';

import { orderApi } from '../api/order';
import { useCrud } from '../hooks/useCrud';
import { type IOrder } from '../api/types/IOrder';

import './styles/crud-pages.css';
import './styles/CashOrdersPage.css';
import { OrderState } from '../../cliente/types/IOrderData';

export const OrderDashboard: React.FC = () => {
    const {
        data: orders,
        loading,
        error,
        fetchData,
        updateItem,
    } = useCrud<IOrder>(orderApi);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');
    const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('TODOS');

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const statusOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'ESTADO' },
        { value: 'PENDING', label: 'PENDIENTE' },
        { value: 'PREPARING', label: 'EN COCINA' },
        { value: 'ARRIVED', label: 'LISTO PARA ENTREGAR' },
        { value: 'CANCELED', label: 'CANCELADO' },
        { value: 'REJECTED', label: 'RECHAZADO' },
    ], []);

    const deliveryTypeOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'ENTREGA' },
        { value: 'DELIVERY', label: 'DELIVERY' },
        { value: 'LOCAL', label: 'LOCAL' },
    ], []);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order.clientName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'TODOS' || order.orderState === statusFilter;
            const matchesDelivery = deliveryTypeFilter === 'TODOS' || order.tipoEntrega === deliveryTypeFilter;
            return matchesSearch && matchesStatus && matchesDelivery;
        });
    }, [orders, searchTerm, statusFilter, deliveryTypeFilter]);

    const orderColumns: ITableColumn<IOrder>[] = useMemo(() => [
        { id: 'id', label: 'ID Orden', numeric: true },
        { id: 'clientName', label: 'Cliente' },
        { id: 'orderDate', label: 'Fecha' },
        {
            id: 'total',
            label: 'Total',
            numeric: true,
            render: (item) => `$${item.total.toFixed(2)}`
        },
        {
            id: 'orderState',
            label: 'Estado',
            render: (item) => item.orderState
        },
        {
            id: 'tipoEntrega',
            label: 'Tipo Entrega',
        },
        {
            id: 'acciones',
            label: 'Acciones',
            render: (item) => (
                <div className="table-actions">
                    <Button
                        variant="outline-primary"
                        size="small"
                        onClick={() => console.log('Ver detalles de:', item.id)}
                    >
                        Ver Detalles
                    </Button>

                    {item.orderState === 'PENDING' && (
                        <Button
                            variant="primary"
                            size="small"
                            onClick={() =>
                                updateItem({ ...item, orderState: OrderState.PREPARING })
                            }
                        >
                            Aceptar Orden
                        </Button>
                    )}

                    {item.orderState === OrderState.PREPARING && (
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() =>
                                updateItem({ ...item, orderState: OrderState.ARRIVED })
                            }
                        >
                            Lista p/ Entregar
                        </Button>
                    )}
                </div>
            ),
        },
    ], [updateItem]);

    if (loading) return <p>Cargando órdenes...</p>;
    if (error) return <p>Error al cargar órdenes: {error}</p>;

    return (
        <div className="crud-page-container">
            <div className="page-header">
                <h2>Gestión de Órdenes</h2>
            </div>

            <div className="filter-controls">
                <InputField
                    name="searchOrders"
                    type="search"
                    placeholder="Buscar por cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <SelectField
                    name="statusFilter"
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="status-select"
                />
                <SelectField
                    name="deliveryTypeFilter"
                    options={deliveryTypeOptions}
                    value={deliveryTypeFilter}
                    onChange={(e) => setDeliveryTypeFilter(e.target.value)}
                    className="status-select"
                />
            </div>

            <GenericTable data={filteredOrders} columns={orderColumns} />
        </div>
    );
};
