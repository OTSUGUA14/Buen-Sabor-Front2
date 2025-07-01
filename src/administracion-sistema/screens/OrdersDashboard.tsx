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
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editState, setEditState] = useState<string>('');

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
        {
            id: "acciones" as const,
            label: "Acciones",
            render: (item) => (
                <button
                    className="client-orders-detail-btn"
                    onClick={() => {
                        setSelectedOrder(item);
                        setEditState(item.orderState);
                        setIsModalOpen(true);
                    }}
                >
                    Ver Detalles
                </button>
            )
        }
    ], []);

    if (loading) return <p>Cargando órdenes...</p>;
    if (error) return <p>Error al cargar órdenes: {error}</p>;

    return (
        <div className="crud-page-container">
            <div className="page-header">
                <h2>ÓRDENES</h2>
            </div>

            <div className="filter-controls">
                <InputField
                    name="searchOrders"
                    type="search"
                    placeholder="Buscar"
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

            {isModalOpen && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Detalle de Orden #{selectedOrder.id}</h3>
                        <p><b>Cliente:</b> {selectedOrder.client?.firstName} {selectedOrder.client?.lastName}</p>
                        <p><b>Teléfono:</b> {selectedOrder.client?.phoneNumber}</p>
                        <p><b>Email:</b> {selectedOrder.client?.email}</p>
                        <p><b>Fecha:</b> {selectedOrder.orderDate}</p>
                        <p><b>Estado:</b>
                            <select
                                value={editState}
                                onChange={e => setEditState(e.target.value)}
                            >
                                <option value="PENDING">PENDIENTE</option>
                                <option value="PREPARING">EN COCINA</option>
                                <option value="ARRIVED">LISTO PARA ENTREGAR</option>
                                <option value="BILLED">FACTURADO</option>
                                <option value="READY_FOR_DELIVERY">LISTO PARA DELIVERY</option>
                                <option value="ON_THE_WAY">EN CAMINO</option>
                                <option value="CANCELED">CANCELADO</option>
                                <option value="REJECTED">RECHAZADO</option>
                            </select>
                        </p>
                        <p><b>Tipo de Entrega:</b> {selectedOrder.orderType}</p>
                        <p><b>Método de Pago:</b> {selectedOrder.payMethod}</p>
                        <p><b>Total:</b> ${selectedOrder.total}</p>
                        <p><b>Dirección:</b> {selectedOrder.directionToSend ?? '-'}</p>
                        <p><b>Hora estimada de entrega:</b> {selectedOrder.estimatedFinishTime}</p>
                        <hr />
                        <h4>Detalles:</h4>
                        <ul>
                            {selectedOrder.orderDetails?.map((detail: any, idx: number) => (
                                <li key={idx}>
                                    Artículo ID: {detail.manufacturedArticleId} | Cantidad: {detail.quantity} | Subtotal: ${detail.subTotal}
                                </li>
                            ))}
                        </ul>
                        <div style={{marginTop: 16}}>
                            <button
                                onClick={async () => {
                                    await orderApi.update({ ...selectedOrder, orderState: editState });
                                    setIsModalOpen(false);
                                    fetchData();
                                }}
                            >
                                Guardar Estado
                            </button>
                            <button style={{marginLeft: 8}} onClick={() => setIsModalOpen(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
