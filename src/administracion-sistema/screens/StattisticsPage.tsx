import { useEffect, useState, useRef } from 'react';
import { Button } from '../components/common/Button';
import { GenericTable } from '../components/crud/GenericTable';
import {
    LineChart, Line, PieChart, Pie, Tooltip, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export const StattisticsPage: React.FC = () => {
    const [stats, setStats] = useState<OrdersStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const chartRef = useRef<HTMLDivElement>(null);

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

    if (loading) return <p>Cargando estadísticas...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!stats) return null;

    // Data for line chart
    const lineData = [
        { name: 'Entregados', value: stats.deliveredOrders },
        { name: 'Pendientes', value: stats.pendingOrders },
        { name: 'Cancelados', value: stats.canceledOrders },
    ];

    // Data for pie chart
    const pieData = [
        { name: 'En local', value: stats.ordersByType.ON_SITE },
        { name: 'Para llevar', value: stats.ordersByType.TAKEAWAY },
        { name: 'Delivery', value: stats.ordersByType.DELIVERY },
    ];

    // Export charts to Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet([
            { Métrica: "Entregados", Cantidad: stats.deliveredOrders },
            { Métrica: "Pendientes", Cantidad: stats.pendingOrders },
            { Métrica: "Cancelados", Cantidad: stats.canceledOrders },
            { Métrica: "En local", Cantidad: stats.ordersByType.ON_SITE },
            { Métrica: "Para llevar", Cantidad: stats.ordersByType.TAKEAWAY },
            { Métrica: "Delivery", Cantidad: stats.ordersByType.DELIVERY },
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Estadísticas");
        XLSX.writeFile(wb, "estadisticas.xlsx");
    };

    // Export charts to PDF
    const exportToPDF = async () => {
        if (!chartRef.current) return;
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL("image/png");
    
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
    
        // Scale image to fit page width while keeping aspect ratio
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
        pdf.addImage(imgData, "PNG", 0, 20, imgWidth, imgHeight);
        pdf.save("estadisticas.pdf");
    };
    

    return (
        <div className="crud-page-container">
            <div className="page-header flex flex-col items-start gap-2">
            <h2>ESTADÍSTICAS</h2>
            <div className="flex gap-2">
                <Button onClick={exportToExcel}>Exportar a Excel</Button>
                <Button onClick={exportToPDF}>Exportar a PDF</Button>
            </div>
            </div>

            <GenericTable
                data={[
                    { id: 1, label: 'Total de pedidos', value: stats.totalOrders },
                    { id: 2, label: 'Ingresos totales', value: `$${stats.totalRevenue}` },
                    { id: 3, label: 'Costo total', value: `$${stats.totalCost}` },
                    { id: 4, label: 'Ganancia', value: `$${stats.profit}` },
                    { id: 5, label: 'Pedidos cancelados', value: stats.canceledOrders },
                    { id: 6, label: 'Pedidos pendientes', value: stats.pendingOrders },
                    { id: 7, label: 'Pedidos entregados', value: stats.deliveredOrders },
                ]}
                columns={[
                    { id: "label", label: "Estadística" },
                    { id: "value", label: "Valor" },
                ]}
            />

            <div ref={chartRef} style={{ marginTop: 32 }}>
                <h3>Evolución de pedidos</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>

                <h3 style={{ marginTop: 32 }}>Pedidos por tipo</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                            {pieData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
