import { type OrderDetailDTO, OrderState, PayMethod } from '../../../cliente/types/IOrderData.ts'; 

export interface IOrder {
    id: number;                       
    clientId: number;
    clientName: string;               
    orderDate: string;
    estimatedFinishTime: string;
    total: number;
    totalCost: number;
    orderState: OrderState;
    orderTypeId: number;
    payMethod: PayMethod;
    takeAway: boolean;
    subsidiaryId: number;
    orderDetails: OrderDetailDTO[];

    // Agregado útil para mostrarlo fácil en la tabla
    tipoEntrega: 'DELIVERY' | 'LOCAL';
}
