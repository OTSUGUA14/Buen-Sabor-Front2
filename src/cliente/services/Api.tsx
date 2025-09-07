import type { IProduct } from "../../administracion-sistema/api/types/IProduct";
import type { OrderRequestDTO, UserPreferenceRequest, } from "../types/IOrderData";
import type { Category } from "../types/IProductClient";
import type { UserRegister } from "../types/UserData";
import type { UserLogin } from "../types/UserLogin";

export const registerUser = async (userToSend: UserRegister): Promise<void> => {
    try {
        // Ajustar fecha a formato ISO-8601
        const userWithFormattedDate = {
            ...userToSend,
            birthDate: new Date(userToSend.birthDate).toISOString()
        };

        console.log(userWithFormattedDate);

        const response = await fetch('http://localhost:8080/client/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userWithFormattedDate),
        });

        if (!response.ok) {
            throw new Error('Error al registrar el usuario');
        }

        alert('Usuario registrado correctamente');
        window.location.href = '/login';
    } catch (error) {
        alert('Ocurrió un error al registrarse. Inténtalo de nuevo.');
        console.error(error);
    }
};

// obtener localidades de la base
export async function getLocations() {
    const response = await fetch("http://localhost:8080/location/getAll");
    if (!response.ok) throw new Error("Error al obtener localidades");
    return response.json();
}

export const loginUser = async (userToLogin: UserLogin): Promise<any> => {
    try {
        const response = await fetch('http://localhost:8080/client/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userToLogin),
        });
        console.log(userToLogin);
        
        if (!response.ok) {
            throw new Error('Error al iniciar sesión');
        }

        const text = await response.text();
        const match = text.match(/ID:\s*(\d+)/);
        if (match) {
            const userId = match[1];
            const profile = await getProfileById(userId);
            alert('Inicio de sesión completado');
            // NO redirijas aquí
            return profile;
        } else {
            alert('Respuesta inesperada del servidor');
        }
    } catch (error) {
        alert('Error al iniciar sesión.');
        console.error(error);
    }
};
export const getProfileById = async (id: string | number) => {
    const response = await fetch(`http://localhost:8080/client/ID/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener el perfil');
    return await response.json();
};

export const getProfileBygmail = async (gmail: string) => {
    const response = await fetch(`http://localhost:8080/client/email/${gmail}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener el perfil');
    return await response.json();
};

export const getProduct = async (userToLogin: IProduct): Promise<void> => {
    try {
        console.log(userToLogin);

        const response = await fetch('http://localhost:8080/manufacturedArticle/getAll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userToLogin),
        });

        if (!response.ok) {
            throw new Error('Error al registrar el usuario');
        }

        alert('Inicio de sesion completado');
        window.location.href = '/menu';
    } catch (error) {
        alert('error al iniciar sesion.');
        console.error(error);
    }
};

export const getCategopryAll = async (): Promise<[Category]> => {
    const urlServer = 'http://localhost:8080/category/getAll';
    const response = await fetch(urlServer, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
    });



    return await response.json();
}

export async function createPreferenceMP(pedido: UserPreferenceRequest[]) {
    const urlServer = 'http://localhost:8080/api/orders/createPreference';
    const response = await fetch(urlServer, {
        method: "POST",
        body: JSON.stringify(pedido),
        headers: {
            "Content-Type": "application/json"
        }
    });

    return await response.json(); 
}


export async function createOrder(pedido?: OrderRequestDTO) {
    let urlServer = 'http://localhost:8080/api/orders';
    let method: string = "POST";
    console.log(pedido);

    const response = await fetch(urlServer, {
        "method": method,
        "body": JSON.stringify(pedido),
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Error al crear la orden');
    }
    alert("Su order se envio correctmante");
    return await response.json()
}

export const fetchAndStoreOAuthUser = async () => {
    const response = await fetch('http://localhost:8080/oauth2/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // 👈 necesario para enviar la sesión
    });

    if (!response.ok) {
        console.error('Error al obtener usuario:', response.status);
        return;
    }
    console.log(response);

    // const user = await response.json();
    // localStorage.setItem('profile', JSON.stringify(user));
};



//Funcion para editar datos del cliente
export const updateUser = async (id: number, updatedData: any) => {
    try {
        if (updatedData.birthDate) {
            updatedData.birthDate = new Date(updatedData.birthDate).toISOString();
        }

        console.log("BODY A ENVIAR:", JSON.stringify(updatedData, null, 2)); 

        const response = await fetch(`http://localhost:8080/client/update/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }

        const updatedUser = await response.json();
        return updatedUser;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
