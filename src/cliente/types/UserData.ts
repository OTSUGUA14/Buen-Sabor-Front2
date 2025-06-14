export interface Domicile {
    street: string;
    zipCode: string;
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
    name: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    birthDate: string;
    username: string;
    password: string;
    auth0Id?: string | null;
    userImage?: string | null;
    domiciles?: Domicile[];
}