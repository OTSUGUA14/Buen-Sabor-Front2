// ClientOrdersPage.tsx

import { useEffect, useMemo, useState } from 'react';
import { GenericTable } from '../../administracion-sistema/components/crud/GenericTable';
import type { ITableColumn } from '../../administracion-sistema/components/crud/GenericTable.types';
import { InputField } from '../../administracion-sistema/components/common/InputField';
import { SelectField } from '../../administracion-sistema/components/common/SelectField';
import type { ISelectOption } from '../../administracion-sistema/components/crud/GenericForm.types';

import { orderApi } from '../../administracion-sistema/api/order';
import { useCrud } from '../../administracion-sistema/hooks/useCrud';
import { type IOrder } from '../../administracion-sistema/api/types/IOrder';

import '../styles/Orders.css';

export const Orders: React.FC = () => {
    const {
        data: orders,
        loading,
        error,
        fetchData,
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
    ], []);

    if (loading) return <p>Cargando órdenes...</p>;
    if (error) return <p>Error al cargar órdenes: {error}</p>;

    return (
        <div className="client-orders-container">
            <div className="client-orders-header">
                <h2>Mis Órdenes</h2>
            </div>

            <div className="client-orders-filters">
                <InputField
                    name="searchOrders"
                    type="search"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="client-orders-search"
                />
                <SelectField
                    name="statusFilter"
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="client-orders-select"
                />
                <SelectField
                    name="deliveryTypeFilter"
                    options={deliveryTypeOptions}
                    value={deliveryTypeFilter}
                    onChange={(e) => setDeliveryTypeFilter(e.target.value)}
                    className="client-orders-select"
                />
            </div>

            <GenericTable data={filteredOrders} columns={orderColumns} />
        </div>
    );
};