import { useEffect, useState } from 'react';
import { Button } from '../components/common/Button';
import { InputField } from '../components/common/InputField';
import { GenericTable } from '../components/crud/GenericTable';

type OrdersStatistics = {
    totalOrders: number;
    totalRevenue: number;
    totalCost: number;
    profit: number;
    canceledOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    ordersByType: {
        ON_SITE: number;
        TAKEAWAY: number;
        DELIVERY: number;
    };
};

export const StattisticsPage: React.FC = () => {
    const [stats, setStats] = useState<OrdersStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/orders/statistics')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Error al cargar estadísticas');
                setLoading(false);
            });
    }, []);

    // Estructura para la tabla
    const statsTableData = stats
        ? [
            { id: 1, label: 'Total de pedidos', value: stats.totalOrders },
            { id: 2, label: 'Ingresos totales', value: `$${stats.totalRevenue}` },
            { id: 3, label: 'Costo total', value: `$${stats.totalCost}` },
            { id: 4, label: 'Ganancia', value: `$${stats.profit}` },
            { id: 5, label: 'Pedidos cancelados', value: stats.canceledOrders },
            { id: 6, label: 'Pedidos pendientes', value: stats.pendingOrders },
            { id: 7, label: 'Pedidos entregados', value: stats.deliveredOrders },
        ]
        : [];

    const statsTableColumns = [
        { id: "label" as const, label: "Estadística" },
        { id: "value" as const, label: "Valor" },
    ];

    if (loading) return <p>Cargando estadísticas...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!stats) return null;

    return (
        <div className="crud-page-container">
            <div className="page-header">
                <h2>ESTADÍSTICAS</h2>
            </div>

            <GenericTable
                data={statsTableData}
                columns={statsTableColumns}
            />

            <div style={{ marginTop: 32 }}>
                <h3>Pedidos por tipo</h3>
                <GenericTable
                    data={[
                        { id: 1, tipo: 'En local', cantidad: stats.ordersByType.ON_SITE },
                        { id: 2, tipo: 'Para llevar', cantidad: stats.ordersByType.TAKEAWAY },
                        { id: 3, tipo: 'Delivery', cantidad: stats.ordersByType.DELIVERY },
                    ]}
                    columns={[
                        { id: 'tipo', label: 'Tipo de pedido' },
                        { id: 'cantidad', label: 'Cantidad' },
                    ]}
                />
            </div>
        </div>
    );
};