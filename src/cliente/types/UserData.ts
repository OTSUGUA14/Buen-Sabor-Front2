export interface Domicile {
    street: string;
    zipCode: string; // ✅ Como viene del backend (GET)
    number: number;
    location: {
        name: string;
        province: {
            name: string;
            country: {
                name: string;
                idcountry: number;
            };
            idprovince: number;
        };
        idlocation: number;
    };
    iddomicile: number;
}

export interface UserRegister {
    id?: number;
    name?: string
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    birthDate: string;
    username: string;
    password: string;
    auth0Id?: string | null;
    userImage?: string | null;
    domiciles?: DomicileToSend[];
}

export type DomicileToSend = {
    street: string;
    zipcode: string; // ✅ Como lo espera el backend (POST/PUT)
    number: number;
    location: number; // solo el id
};

// ✅ Añadir interfaz para manejo simple del domicilio
export interface SimpleDomicile {
    street: string;
    zipcode: string; // Para envío al backend
    number: number;
    location: number;
}