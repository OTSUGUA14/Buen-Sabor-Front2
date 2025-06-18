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
    orderType: OrderType;
    payMethod: PayMethod;
    orderDate: string;
    takeAway: boolean;
    clientId: number;
    subsidiaryId: number;
    orderDetails: OrderDetailDTO[];
}

export enum OrderType {
  DELIVERY = "DELIVERY",
  TAKEAWAY = "TAKEAWAY",
  ON_SITE = "ON_SITE"
}

export interface UserPreferenceRequest {
    title: string;
    quantity: number;
    price: string;
}