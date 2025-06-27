

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

export enum OrderState {
    PREPARING = "PREPARING",
    PENDING = "PENDING",
    CANCELED = "CANCELED",
    REJECTED = "REJECTED",
    ARRIVED = "ARRIVED",
    BILLED="BILLED",
    READY_FOR_DELIVERY ="READY_FOR_DELIVERY",   
    ON_THE_WAY = "ON_THE_WAY",
}

export enum PayMethod {
    CASH = "CASH",
    MERCADOPAGO = "MERCADOPAGO"
}


export enum OrderType {
    DELIVERY = "DELIVERY",
    TAKEAWAY = "TAKEAWAY",
    ON_SITE = "ON_SITE"
}
export interface OrderDetailDTO {
    manufacturedArticleId: number;
    quantity: number;
    subTotal: number;
}