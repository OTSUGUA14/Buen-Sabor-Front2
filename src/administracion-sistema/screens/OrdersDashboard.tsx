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
import { Button } from '../components/common/Button';

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

    // Opciones para tipo de entrega
    const deliveryTypeOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TIPO ENTREGA' },
        { value: 'DELIVERY', label: 'Delivery' },
        { value: 'TAKE_AWAY', label: 'Take Away' },
        { value: 'IN_PLACE', label: 'En el local' }
    ];

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
                { value: 'PREPARING', label: 'EN COCINA' }
            ];
        }
        if (isChef) {
            return [
                { value: 'TODOS', label: 'ESTADO' },
                { value: 'PREPARING', label: 'EN COCINA' },
                { value: 'READY_FOR_DELIVERY', label: 'LISTO PARA DELIVERY' }
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
            { value: 'READY_FOR_DELIVERY', label: 'LISTO PARA DELIVERY' },
            { value: 'ON_THE_WAY', label: 'EN CAMINO' },
            { value: 'ARRIVED', label: 'ENTREGADO' },
            { value: 'CANCELED', label: 'CANCELADO' },
            { value: 'REJECTED', label: 'RECHAZADO' },
        ];
    }, [isCashier, isChef, isDriver]);

    // Filtrado de órdenes
    const filteredOrders = useMemo(() => {
        let filtered = orders;
        if (isCashier) {
            // Cajero ve órdenes PENDING y puede gestionarlas
            filtered = filtered.filter(order =>
                ["PENDING", "CANCELED", "PREPARING"].includes(order.orderState)
            );
        } else if (isChef) {
            // Cocinero ve órdenes PREPARING y puede marcarlas como listas
            filtered = filtered.filter(order =>
                ["PREPARING", "READY_FOR_DELIVERY"].includes(order.orderState)
            );
        } else if (isDriver) {
            // Repartidor ve órdenes listas para delivery
            filtered = filtered.filter(order =>
                ["READY_FOR_DELIVERY", "ON_THE_WAY", "ARRIVED"].includes(order.orderState)
            );
        }
        return filtered.filter(order => {
            const matchesSearch = (order.clientName ?? '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'TODOS' || order.orderState === statusFilter;
            const matchesDelivery = isCashier || isChef || isDriver
                ? true
                : (deliveryTypeFilter === 'TODOS' || order.tipoEntrega === deliveryTypeFilter);
            return matchesSearch && matchesStatus && matchesDelivery;
        });
    }, [orders, searchTerm, statusFilter, deliveryTypeFilter, isCashier, isChef, isDriver]);

    // Estados disponibles para cada rol en el modal
    const getStateOptionsForRole = () => {
        if (isCashier) {
            return [
                { value: "PENDING", label: "PENDIENTE" },
                { value: "CANCELED", label: "CANCELADO" },
                { value: "PREPARING", label: "ENVIAR A COCINA" }
            ];
        }
        if (isChef) {
            return [
                { value: "PREPARING", label: "EN COCINA" },
                { value: "READY_FOR_DELIVERY", label: "LISTO PARA DELIVERY" }
            ];
        }
        if (isDriver) {
            return [
                { value: "READY_FOR_DELIVERY", label: "LISTO PARA DELIVERY" },
                { value: "ON_THE_WAY", label: "EN CAMINO" },
                { value: "ARRIVED", label: "ENTREGADO" }
            ];
        }
        // Admin - todos los estados
        return [
            { value: "PENDING", label: "PENDIENTE" },
            { value: "PREPARING", label: "EN COCINA" },
            { value: "READY_FOR_DELIVERY", label: "LISTO PARA DELIVERY" },
            { value: "ON_THE_WAY", label: "EN CAMINO" },
            { value: "ARRIVED", label: "ENTREGADO" },
            { value: "CANCELED", label: "CANCELADO" },
            { value: "REJECTED", label: "RECHAZADO" }
        ];
    };

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
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {item.orderState === "READY_FOR_DELIVERY" && (
                            <Button
                                variant="primary"
                                size="small"
                                onClick={async () => {
                                    try {
                                        await orderApi.updateOrderState(item.id, OrderState.ON_THE_WAY);
                                        fetchData();
                                    } catch (error) {
                                        console.error('Error updating order:', error);
                                    }
                                }}
                            >
                                Tomar pedido
                            </Button>
                        )}
                        {item.orderState === "ON_THE_WAY" && (
                            <Button
                                variant="primary"
                                size="small"
                                onClick={async () => {
                                    try {
                                        await orderApi.updateOrderState(item.id, OrderState.ARRIVED);
                                        fetchData();
                                    } catch (error) {
                                        console.error('Error updating order:', error);
                                    }
                                }}
                            >
                                Marcar entregado
                            </Button>
                        )}
                        <Button
                            variant="actions"
                            size="small"
                            onClick={() => {
                                setSelectedOrder(item);
                                setEditState(item.orderState);
                                setIsModalOpen(true);
                            }}
                            title="Ver detalles"
                        >
                            <img
                                src="../../../public/icons/eye-on.svg"
                                alt="Ver"
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    filter: 'invert(52%) sepia(94%) saturate(636%) hue-rotate(1deg) brightness(103%) contrast(102%)'
                                }}
                            />
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="actions"
                        size="small"
                        onClick={() => {
                            setSelectedOrder(item);
                            setEditState(item.orderState);
                            setIsModalOpen(true);
                        }}
                        title="Ver detalles"
                    >
                        <img
                            src="../../../public/icons/eye-on.svg"
                            alt="Ver"
                            style={{
                                width: '18px',
                                height: '18px',
                                filter: 'invert(52%) sepia(94%) saturate(636%) hue-rotate(1deg) brightness(103%) contrast(102%)'
                            }}
                        />
                    </Button>
                )
            )
        }
    ], [isDriver, fetchData]);

    // Función para actualizar el estado de la orden
    const handleUpdateOrderState = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOrder && editState !== selectedOrder.orderState) {
            try {
                await orderApi.updateOrderState(selectedOrder.id, editState as OrderState);
                setIsModalOpen(false);
                fetchData();
            } catch (error) {
                console.error('Error updating order state:', error);
                alert('Error al actualizar el estado de la orden');
            }
        } else {
            setIsModalOpen(false);
        }
    };

    if (loading) return <p>Cargando órdenes...</p>;
    if (error) return <p>Error al cargar órdenes: {error}</p>;

    return (
        <div className="crud-page-container">
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
                {!isCashier && !isChef && !isDriver && (
                    <SelectField
                        name="deliveryTypeFilter"
                        options={deliveryTypeOptions}
                        value={deliveryTypeFilter}
                        onChange={(e) => setDeliveryTypeFilter(e.target.value)}
                        className="status-select"
                    />
                )}
            </div>

            <GenericTable data={filteredOrders} columns={orderColumns} />

            <FormModal
                isOpen={isModalOpen && !!selectedOrder}
                onClose={() => setIsModalOpen(false)}
                title={selectedOrder ? `Detalle de Orden #${selectedOrder.id}` : ''}
                onSubmit={handleUpdateOrderState}
            >
                {selectedOrder && (
                    <div className="order-modal-custom">
                        <div className="order-modal-section">
                            <div className="section-title">
                                <span role="img" aria-label="Cliente">👤</span> Cliente
                            </div>
                            <div className="order-modal-table">
                                <div className="order-modal-row order-modal-header">
                                    <div>Nombre</div>
                                    <div>Dirección</div>
                                    <div>Teléfono</div>
                                </div>
                                <div className="order-modal-row">
                                    <div>{selectedOrder.client?.firstName} {selectedOrder.client?.lastName}</div>
                                    <div>{selectedOrder.directionToSend ?? '-'}</div>
                                    <div>{selectedOrder.client?.phoneNumber}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="order-modal-section">
                            <div className="section-title">
                                <span role="img" aria-label="Pedido">📋</span> Información del Pedido
                            </div>
                            <div className="order-modal-table">
                                <div className="order-modal-row order-modal-header">
                                    <div>Fecha</div>
                                    <div>Estado</div>
                                    <div>Tipo</div>
                                </div>
                                <div className="order-modal-row">
                                    <div>{selectedOrder.orderDate}</div>
                                    <div>{selectedOrder.orderState}</div>
                                    <div>{selectedOrder.orderType || selectedOrder.tipoEntrega}</div>
                                </div>
                            </div>
                        </div>

                        <div className="order-modal-section">
                            <div className="section-title">
                                <span role="img" aria-label="Detalle">📋</span> Detalle
                            </div>
                            <div className="order-modal-table">
                                <div className="order-modal-row order-modal-header">
                                    <div>Producto</div>
                                    <div>Cantidad</div>
                                    <div>Precio Unit.</div>
                                    <div>Subtotal</div>
                                </div>
                                {selectedOrder.manufacturedArticles?.map((article: any, idx: number) => (
                                    <div className="order-modal-row" key={`manufactured-${idx}`}>
                                        <div>{article.name || 'Producto manufacturado'}</div>
                                        <div>{article.quantityOrdered || 1}</div>
                                        <div>${(article.price || 0).toFixed(2)}</div>
                                        <div>${((article.quantityOrdered || 1) * (article.price || 0)).toFixed(2)}</div>
                                    </div>
                                ))}
                                {selectedOrder.orderedArticles?.map((article: any, idx: number) => (
                                    <div className="order-modal-row" key={`ordered-${idx}`}>
                                        <div>{article.name || 'Artículo'}</div>
                                        <div>{article.quantity || 1}</div>
                                        <div>${(article.price || 0).toFixed(2)}</div>
                                        <div>${((article.quantity || 1) * (article.price || 0)).toFixed(2)}</div>
                                    </div>
                                ))}
                                
                            </div>
                        </div>

                        <div className="order-modal-section">
                            <div className="section-title">
                                <span role="img" aria-label="Estado">🗂️</span> Estado
                            </div>
                            <div style={{ marginTop: 8 }}>
                                <select
                                    value={editState}
                                    onChange={e => setEditState(e.target.value)}
                                    style={{ minWidth: 160, padding: '6px', borderRadius: 6, border: '1px solid #ccc' }}
                                >
                                    {getStateOptionsForRole().map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="order-actions" style={{ marginTop: 24 }}>
                            <Button variant="primary" type="submit">
                                Guardar
                            </Button>
                            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                )}
            </FormModal>
        </div>
    );
};
