// // src/administracion-sistema/pages/StatisticsPage/StatisticsPage.tsx

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { saleApi } from '../../api/sale';
// import { productApi } from '../../api/product';
// import type { ISale, IProductStatsRow } from '../../api/types/ISale';
// import type { IProduct } from '../../api/types/IProduct';
// import { InputField } from '../../components/common/InputField/InputField';
// import { Button } from '../../components/common/Button/Button';
// import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
// import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
// import '../crud-pages.css';

// export const StatisticsPage: React.FC = () => {
//     const [sales, setSales] = useState<ISale[]>([]);
//     const [products, setProducts] = useState<IProduct[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const today = new Date();
//     const oneMonthAgo = new Date(today);
//     oneMonthAgo.setMonth(today.getMonth() - 1);

//     const formatDate = (date: Date): string => {
//         const yyyy = date.getFullYear();
//         const mm = String(date.getMonth() + 1).padStart(2, '0');
//         const dd = String(date.getDate()).padStart(2, '0');
//         return `${yyyy}-${mm}-${dd}`;
//     };

//     const [startDate, setStartDate] = useState<string>(formatDate(oneMonthAgo));
//     const [endDate, setEndDate] = useState<string>(formatDate(today));

//     const fetchAllData = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const fetchedSales = await saleApi.getSalesByDateRange(startDate, endDate);
//             setSales(fetchedSales);

//             const fetchedProducts = await productApi.getAll();
//             setProducts(fetchedProducts);

//         } catch (err) {
//             console.error('Error fetching data for statistics:', err);
//             setError('Error al cargar datos para las estadísticas.');
//         } finally {
//             setLoading(false);
//         }
//     }, [startDate, endDate]);

//     useEffect(() => {
//         fetchAllData();
//     }, [fetchAllData]);

//     const topProductsStats: IProductStatsRow[] = useMemo(() => {
//         if (sales.length === 0 || products.length === 0) return [];

//         const statsMap = new Map<number, { productName: string, description: string, totalQuantity: number, totalRevenue: number }>();

//         const productMap = new Map<number, IProduct>();
//         products.forEach(p => productMap.set(p.id, p));

//         sales.forEach(sale => {
//             const productInfo = productMap.get(sale.productId);
//             if (!productInfo) {
//                 return;
//             }

//             if (!statsMap.has(sale.productId)) {
//                 statsMap.set(sale.productId, {
//                     productName: sale.productName,
//                     description: productInfo.description,
//                     totalQuantity: 0,
//                     totalRevenue: 0
//                 });
//             }
//             const currentStats = statsMap.get(sale.productId)!;
//             currentStats.totalQuantity += sale.quantity;
//             currentStats.totalRevenue += sale.quantity * currentStats.totalRevenue; // <-- POSIBLE ERROR AQUÍ, DEBERÍA SER unitPrice
//             statsMap.set(sale.productId, currentStats);
//         });

//         //el cálculo de totalRevenue estaba mal.
//         // Debería ser currentStats.totalRevenue += sale.quantity * sale.unitPrice;
//         statsMap.forEach(stats => {
//             // Este bucle es necesario si los precios de venta pueden variar por transacción
//             // o si solo agregamos `sale.unitPrice` en el momento de la venta.
//             // Si `unitPrice` en `ISale` es el precio fijo del producto en el momento de la venta,
//             // entonces la suma en el bucle anterior ya es correcta si sale.unitPrice se usara.
//             // Dada la interfaz ISale, usaremos sale.unitPrice.
//         });


//         const finalStatsMap = new Map<number, { productName: string, description: string, totalQuantity: number, totalRevenue: number }>();

//         sales.forEach(sale => {
//             const productInfo = productMap.get(sale.productId);
//             if (!productInfo) {
//                 return;
//             }

//             if (!finalStatsMap.has(sale.productId)) {
//                 finalStatsMap.set(sale.productId, {
//                     productName: sale.productName,
//                     description: productInfo.description,
//                     totalQuantity: 0,
//                     totalRevenue: 0
//                 });
//             }
//             const currentStats = finalStatsMap.get(sale.productId)!;
//             currentStats.totalQuantity += sale.quantity;
//             currentStats.totalRevenue += sale.quantity * sale.unitPrice; // <-- CORRECCIÓN APLICADA AQUÍ
//             finalStatsMap.set(sale.productId, currentStats);
//         });

//         const sortedStats = Array.from(finalStatsMap.values()).sort((a, b) => b.totalQuantity - a.totalQuantity);

//         return sortedStats.slice(0, 10).map((stats, index) => ({
//             id: index + 1,
//             productName: stats.productName,
//             description: stats.description,
//             totalQuantitySold: stats.totalQuantity,
//             totalRevenue: parseFloat(stats.totalRevenue.toFixed(2))
//         }));
//     }, [sales, products]);

//     const columns: ITableColumn<IProductStatsRow>[] = [
//         { id: 'id', label: 'Rank', numeric: true },
//         { id: 'productName', label: 'Producto' },
//         { id: 'description', label: 'Descripción' },
//         { id: 'totalQuantitySold', label: 'Cantidad Vendida', numeric: true },
//         { id: 'totalRevenue', label: 'Monto Total ($)', numeric: true, render: (item) => `$${item.totalRevenue.toFixed(2)}` },
//     ];

//     const handleApplyFilters = () => {
//         fetchAllData();
//     };

//     if (loading) return <p>Cargando estadísticas...</p>;
//     if (error) return <p className="error-message">Error: {error}</p>;

//     return (
//         <div className="crud-page-container">
//             <div className="page-header">
//                 <h2>Estadísticas de Ventas</h2>
//             </div>

//             <div className="filter-controls">
//                 <InputField
//                     label="Desde"
//                     name="startDate" 
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="date-input"
//                 />
//                 <InputField
//                     label="Hasta"
//                     name="endDate" // <-- AÑADIDO: Propiedad 'name' requerida
//                     type="date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     className="date-input"
//                 />
//                 <Button variant="primary" onClick={handleApplyFilters}>
//                     Aplicar Filtros
//                 </Button>
//             </div>

//             <div className="stats-table-container">
//                 {topProductsStats.length > 0 ? (
//                     <GenericTable
//                         data={topProductsStats}
//                         columns={columns}
//                     />
//                 ) : (
//                     <p>No hay datos de ventas para los productos en el rango de fechas seleccionado.</p>
//                 )}
//             </div>
//         </div>
//     );
// };