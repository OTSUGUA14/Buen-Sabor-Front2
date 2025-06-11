import type { IProduct } from "../administracion-sistema/api/types/IProduct";
import type { Category } from "../type/IProductClient";
import type { UserRegister } from "../type/UserData";
import type { UserLogin } from "../type/UserLogin";


/**
 * Envía los datos del usuario para registrarlo en el servidor.
 * @param userToSend Objeto con los datos del usuario a registrar.
 */

export const registerUser = async (userToSend: UserRegister): Promise<void> => {
    try {
        // Ajustar fecha a formato ISO-8601
        const userWithFormattedDate = {
            ...userToSend,
            birthDate: new Date(userToSend.birthDate).toISOString()
        };


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

export const loginUser = async (userToLogin: UserLogin): Promise<void> => {
    try {
        console.log(userToLogin);

        const response = await fetch('http://localhost:8080/client/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userToLogin),
        });

        if (!response.ok) {
            throw new Error('Error al registrar el usuario');
        }

        alert('Inicio de sesion completado');
        
    } catch (error) {
        alert('error al iniciar sesion.');
        console.error(error);
    }
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