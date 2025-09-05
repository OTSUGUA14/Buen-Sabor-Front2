// ClientOrdersPage.tsx

import { useEffect, useMemo, useState } from 'react';
import { GenericTable } from '../../administracion-sistema/components/crud/GenericTable';
import type { ITableColumn } from '../../administracion-sistema/components/crud/GenericTable.types';
import { InputField } from '../../administracion-sistema/components/common/InputField';
import { SelectField } from '../../administracion-sistema/components/common/SelectField';
import type { ISelectOption } from '../../administracion-sistema/components/crud/GenericForm.types';
import { FormModal } from '../../administracion-sistema/components/common/FormModal'; // ✅ Importar FormModal
import { Button } from '../../administracion-sistema/components/common/Button'; // ✅ Importar Button

import { orderApi } from '../../administracion-sistema/api/order';
import { useCrud } from '../../administracion-sistema/hooks/useCrud';
import { OrderState, type IOrder } from '../../administracion-sistema/api/types/IOrder';
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
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null); // ✅ Estado para la orden seleccionada
    const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Estado para el modal

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
        // ✅ Columna de acciones actualizada
        {
            id: "acciones" as const,
            label: "Acciones",
            render: (item) => (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Button
                        variant="actions"
                        size="small"
                        onClick={() => {
                            setSelectedOrder(item);
                            setIsModalOpen(true);
                        }}
                        title="Ver detalles"
                    >
                        <img
                            src="/icons/eye-on.svg"
                            alt="Ver"
                            style={{
                                width: '18px',
                                height: '18px',
                                filter: 'invert(52%) sepia(94%) saturate(636%) hue-rotate(1deg) brightness(103%) contrast(102%)'
                            }}
                        />
                    </Button>

                    {/* ✅ Botón de cancelar orden - solo mostrar si la orden se puede cancelar */}
                    {(item.orderState === 'PENDING' || item.orderState === 'PREPARING') && (
                        <Button
                            variant="danger"
                            size="small"
                            onClick={async () => {
                                if (window.confirm('¿Estás seguro de que deseas cancelar esta orden?')) {
                                    await handleCancelOrder(item);
                                }
                            }}
                            title="Cancelar orden"
                        >
                            Cancelar
                        </Button>
                    )}
                </div>
            )
        }
    ], []);

    // ✅ Función para cancelar una orden actualizada
    const handleCancelOrder = async (order: IOrder) => {
        try {
            await orderApi.updateOrderState(order.id, OrderState.CANCELED);
            await fetchData(); // Recargar los datos

            alert('Orden cancelada exitosamente');
        } catch (error) {
            console.error('Error al cancelar la orden:', error);
            alert('Error al cancelar la orden. Por favor, intenta nuevamente.');
        }
    };

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
    console.log(selectedOrder);

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

            {/* ✅ Modal de detalles */}
            <FormModal
                isOpen={isModalOpen && !!selectedOrder}
                onClose={() => setIsModalOpen(false)}
                title={selectedOrder ? `Detalle de Orden #${selectedOrder.id}` : ''}
                onSubmit={async (e) => {
                    e.preventDefault();
                    setIsModalOpen(false);
                }}
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
                                    <div>{selectedOrder.orderType}</div>
                                </div>
                            </div>
                        </div>

                        <div className="order-modal-section">
                            <div className="section-title">
                                <span role="img" aria-label="Productos">🍕</span> Productos / Promos / Artículos
                            </div>
                            <div className="order-modal-table">
                                <div className="order-modal-row order-modal-header">
                                    <div>Tipo</div>
                                    <div>Nombre</div>
                                    <div>Cantidad</div>
                                    <div>Precio</div>
                                </div>
                                {/* Productos normales */}
                                {selectedOrder.manufacturedArticles?.map((article: any, idx: number) => (
                                    <div className="order-modal-row" key={`prod-${idx}`}>
                                        <div>Producto</div>
                                        <div>{article.name || 'Producto'}</div>
                                        <div>{article.quantityOrdered || 1}</div>
                                        <div>${article.price?.toFixed(2) || '0.00'}</div>
                                    </div>
                                ))}
                                {/* Artículos */}
                                {selectedOrder.orderedArticles?.map((article: any, idx: number) => (
                                    <div className="order-modal-row" key={`art-${idx}`}>
                                        <div>Artículo</div>
                                        <div>{article.denomination || 'Artículo'}</div>
                                        <div>{article.quantity || 1}</div>
                                        <div>${article.buyingPrice?.toFixed(2) || '0.00'}</div>
                                    </div>
                                ))}
                                {/* Promociones */}
                                {(selectedOrder.sales ?? []).map((promo: any, idx: number) => (
                                    <div className="order-modal-row" key={`promo-${idx}`}>
                                        <div>Promo</div>
                                        <div>{promo.denomination || 'Promoción'}</div>
                                        <div>{promo.quantity || 1}</div>z
                                        <div>${promo.salePrice?.toFixed(2) || '0.00'}</div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                )}
            </FormModal>
        </div>
    );
};