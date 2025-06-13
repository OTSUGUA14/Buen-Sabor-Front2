export interface OrderDetailDTO {
    manufacturedArticleId: number;
    quantity: number;
    subTotal: number;
}

export enum OrderState {
    PREPARING = "PREPARING",
    PENDING = "PENDING",
    CANCELED = "CANCELED",
    REJECTED = "REJECTED",
    ARRIVED = "ARRIVED"
}

export enum PayMethod {
    CASH = "CASH",
    MERCADOPAGO = "MERCADOPAGO"
}

export interface OrderRequestDTO {
    estimatedFinishTime: string;
    total: number;
    totalCost: number;
    orderState: OrderState;
    orderTypeId: number;
    payMethod: PayMethod;
    orderDate: string;
    takeAway: boolean;
    clientId: number;
    subsidiaryId: number;
    orderDetails: OrderDetailDTO[];
}
//Mandar mercado pago
export interface UserPreferenceRequest {
    title: string;
    quantity: number;
    price: string;
}