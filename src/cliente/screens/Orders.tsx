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
import { useUser } from '../components/UserContext'; // ✅ Importar el hook de usuario

import '../styles/Orders.css';

export const Orders: React.FC = () => {
    const { profile } = useUser(); // ✅ Obtener el perfil del usuario logueado
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
        { value: 'BILLED', label: 'FACTURADO' },
        { value: 'READY_FOR_DELIVERY', label: 'LISTO PARA DELIVERY' },
        { value: 'ON_THE_WAY', label: 'EN CAMINO' },
        { value: 'CANCELED', label: 'CANCELADO' },
        { value: 'REJECTED', label: 'RECHAZADO' },
    ], []);

    const deliveryTypeOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'ENTREGA' },
        { value: 'DELIVERY', label: 'DELIVERY' },
        { value: 'LOCAL', label: 'LOCAL' },
    ], []);

    // ✅ Filtrar órdenes del usuario actual
    const filteredOrders = useMemo(() => {
        if (!profile?.id) return []; // Si no hay usuario logueado, no mostrar órdenes
        
        return orders.filter(order => {
            // ✅ Solo mostrar órdenes del usuario actual - usar client.clientId en lugar de clientId
            const isUserOrder = order.client?.clientId === profile.id;
            // ✅ Usar client.firstName + client.lastName para la búsqueda
            const clientFullName = `${order.client?.firstName || ''} ${order.client?.lastName || ''}`.toLowerCase();
            const matchesSearch = clientFullName.includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'TODOS' || order.orderState === statusFilter;
            const matchesDelivery = deliveryTypeFilter === 'TODOS' || order.tipoEntrega === deliveryTypeFilter;
            
            return isUserOrder && matchesSearch && matchesStatus && matchesDelivery;
        });
    }, [orders, searchTerm, statusFilter, deliveryTypeFilter, profile?.id]);

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

    // ✅ Verificar si el usuario está logueado
    if (!profile) {
        return (
            <div className="client-orders-container">
                <p>Debes iniciar sesión para ver tus órdenes.</p>
            </div>
        );
    }

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
                    placeholder="Buscar"
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