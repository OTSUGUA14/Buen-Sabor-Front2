import { useEffect, useMemo, useState } from 'react';
import { GenericTable } from '../components/crud/GenericTable';
import type { ITableColumn } from '../components/crud/GenericTable.types';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';
import type { ISelectOption } from '../components/crud/GenericForm.types';
import { OrderState } from '../api/types/IOrder';
import { orderApi } from '../api/order';
import { useCrud } from '../hooks/useCrud';
import { type IOrder } from '../api/types/IOrder';
import { FormModal } from '../components/common/FormModal';

import './styles/crud-pages.css';
import './styles/CashOrdersPage.css';


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

    const role = localStorage.getItem("employeeRole");
    const isCashier = role === "CASHIER";
    const isChef = role === "CHEF";
    const isDriver = role === "DRIVER";

    // Opciones de estado según el rol
    const statusOptions: ISelectOption[] = useMemo(() => {
        if (isCashier) {
            return [
                { value: 'TODOS', label: 'ESTADO' },
                { value: 'PENDING', label: 'PENDIENTE' },
                { value: 'CANCELED', label: 'CANCELADO' },
                { value: 'REJECTED', label: 'RECHAZADO' },
                { value: 'BILLED', label: 'FACTURADO' },
                { value: 'ARRIVED', label: 'LISTO PARA ENTREGAR' }
            ];
        }
        if (isChef) {
            return [
                { value: 'TODOS', label: 'ESTADO' },
                { value: 'BILLED', label: 'FACTURADO' },
                { value: 'PREPARING', label: 'EN COCINA' }
            ];
        }
        if (isDriver) {
            return [
                { value: 'READY_FOR_DELIVERY', label: 'LISTO PARA DELIVERY' }
            ];
        }
        // Admin y otros
        return [
            { value: 'TODOS', label: 'ESTADO' },
            { value: 'PENDING', label: 'PENDIENTE' },
            { value: 'PREPARING', label: 'EN COCINA' },
            { value: 'ARRIVED', label: 'LISTO PARA ENTREGAR' },
            { value: 'BILLED', label: 'FACTURADO' },
            { value: 'READY_FOR_DELIVERY', label: 'LISTO PARA DELIVERY' },
            { value: 'ON_THE_WAY', label: 'EN CAMINO' },
            { value: 'CANCELED', label: 'CANCELADO' },
            { value: 'REJECTED', label: 'RECHAZADO' },
        ];
    }, [isCashier, isChef, isDriver]);

    // Opciones de tipo de entrega (solo para no-cajero)
    const deliveryTypeOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'ENTREGA' },
        { value: 'DELIVERY', label: 'DELIVERY' },
        { value: 'LOCAL', label: 'LOCAL' },
    ], []);

    // Filtrado de órdenes
    const filteredOrders = useMemo(() => {
        let filtered = orders;
        if (isCashier) {
            filtered = filtered.filter(order =>
                ["REJECTED", "CANCELED", "PENDING", "BILLED", "ARRIVED"].includes(order.orderState)
            );
        } else if (isChef) {
            filtered = filtered.filter(order =>
                ["BILLED", "PREPARING"].includes(order.orderState)
            );
        } else if (isDriver) {
            filtered = filtered.filter(order =>
                order.orderState === "READY_FOR_DELIVERY"
            );
        }
        return filtered.filter(order => {
            const matchesSearch = order.clientName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'TODOS' || order.orderState === statusFilter;
            const matchesDelivery = isCashier || isChef || isDriver
                ? true
                : (deliveryTypeFilter === 'TODOS' || order.tipoEntrega === deliveryTypeFilter);
            return matchesSearch && matchesStatus && matchesDelivery;
        });
    }, [orders, searchTerm, statusFilter, deliveryTypeFilter, isCashier, isChef, isDriver]);

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
                isDriver ? (
                    <button
                        className="client-orders-detail-btn"
                        onClick={async () => {
                            // Aquí puedes cambiar el estado a ON_THE_WAY o lo que corresponda
                            await orderApi.update({ ...item, orderState: OrderState.ON_THE_WAY });
                            fetchData();
                        }}
                    >
                        Tomar pedido
                    </button>
                ) : (
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
            )
        }
    ], [isDriver, fetchData]);


    if (loading) return <p>Cargando órdenes...</p>;
    if (error) return <p>Error al cargar órdenes: {error}</p>;

    const cashierStates = [
        { value: "PENDING", label: "PENDIENTE" },
        { value: "CANCELED", label: "CANCELADO" },
        { value: "REJECTED", label: "RECHAZADO" },
        { value: "BILLED", label: "FACTURADO" }
    ];

    const chefStates = [
        { value: "READY_FOR_DELIVERY", label: "LISTO PARA DELIVERY" },
        { value: "ARRIVED", label: "LISTO PARA ENTREGAR" },
        { value: "CANCELED", label: "CANCELADO" }
    ];

    return (
        <div className="crud-page-container">
            {/* <div className="page-header">
                <h2>ÓRDENES</h2>
            </div> */}

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
                {/* Solo muestra el filtro de tipo de entrega si NO es cajero */}
                {!isCashier && (
                    <SelectField
                        name="deliveryTypeFilter"
                        options={deliveryTypeOptions}
                        value={deliveryTypeFilter}
                        onChange={(e) => setDeliveryTypeFilter(e.target.value)}
                        className="status-select"
                    />
                )}
            </div>

            {isCashier && (
                <button
                    className="btn btn-primary"
                    style={{ marginBottom: 16 }}
                    onClick={() => {
                        // Aquí abre tu modal o navega a la página de creación de orden
                        // Por ejemplo:
                        // navigate("/admin/orders/create");
                    }}
                >
                    Crear Orden
                </button>
            )}

            <GenericTable data={filteredOrders} columns={orderColumns} />

            <FormModal
                isOpen={isModalOpen && !!selectedOrder}
                onClose={() => setIsModalOpen(false)}
                title={selectedOrder ? `Detalle de Orden #${selectedOrder.id}` : ''}
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (selectedOrder) {
                        await orderApi.update({ ...selectedOrder, orderState: editState });
                        setIsModalOpen(false);
                        fetchData();
                    }
                }}
            >
                {selectedOrder && (
                    <>
                        <p><b>Cliente:</b> {selectedOrder.client?.firstName} {selectedOrder.client?.lastName}</p>
                        <p><b>Teléfono:</b> {selectedOrder.client?.phoneNumber}</p>
                        <p><b>Email:</b> {selectedOrder.client?.email}</p>
                        <p><b>Fecha:</b> {selectedOrder.orderDate}</p>
                        <p><b>Estado:</b>
                            <select
                                value={editState}
                                onChange={e => setEditState(e.target.value)}
                                style={{ marginLeft: 8 }}
                            >
                                {isCashier
                                    ? cashierStates.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))
                                    : isChef
                                        ? chefStates.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))
                                        : (
                                            <>
                                                <option value="PENDING">PENDIENTE</option>
                                                <option value="PREPARING">EN COCINA</option>
                                                <option value="ARRIVED">LISTO PARA ENTREGAR</option>
                                                <option value="BILLED">FACTURADO</option>
                                                <option value="READY_FOR_DELIVERY">LISTO PARA DELIVERY</option>
                                                <option value="ON_THE_WAY">EN CAMINO</option>
                                                <option value="CANCELED">CANCELADO</option>
                                                <option value="REJECTED">RECHAZADO</option>
                                            </>
                                        )
                                }
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
                        <div style={{ marginTop: 16 }}>
                            <button type="submit">
                                Guardar Estado
                            </button>
                            <button type="button" style={{ marginLeft: 8 }} onClick={() => setIsModalOpen(false)}>
                                Cerrar
                            </button>
                        </div>
                    </>
                )}
            </FormModal>
        </div>
    );
};
