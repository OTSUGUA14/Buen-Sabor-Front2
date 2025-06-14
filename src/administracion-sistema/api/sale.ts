// // src/administracion-sistema/api/sale.ts

// import type { ISale } from './types/ISale';
// import type { IProduct } from './types/IProduct';


// const simulateNetworkLatency = (ms: number = 500) => {
//     return new Promise(resolve => setTimeout(resolve, ms));
// };

// export const saleApi = {
//     getSalesByDateRange: async (startDate: string, endDate: string): Promise<ISale[]> => {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 const filtered = salesData.filter(sale => {
//                     const saleDate = sale.saleDate;
//                     return saleDate >= startDate && saleDate <= endDate;
//                 });
//                 resolve([...filtered]);
//             }, 700);
//         });
//     },
// };