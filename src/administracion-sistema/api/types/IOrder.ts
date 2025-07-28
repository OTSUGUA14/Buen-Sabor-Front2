export interface IOrder {
    id: number;
    estimatedFinishTime: string;
    total: number;
    totalCost: number;
    orderDate: string;
    orderState: OrderState;
    orderType: string;
    payMethod: PayMethod;
    client: {
        clientId: number;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
        birthDate: string;
        domiciles: any;
        username: string;
        password: string;
    };
    directionToSend: string;
    subsidiaryId: number;
    manufacturedArticles: any[];
    orderedArticles: any[];

    // Campos calculados para compatibilidad
    clientId?: number;
    clientName?: string;
    tipoEntrega?: 'DELIVERY' | 'LOCAL';
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