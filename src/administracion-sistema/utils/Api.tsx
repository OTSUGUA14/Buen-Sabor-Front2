import type { IProductClient } from "../../type/IProductClient";

import type { Category, IProduct } from "../api/types/IProduct";

export const getIngredientesAll = async (): Promise<[]> => {
	const urlServer = 'http://localhost:8080/article/getAll';
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



export const getProductsAll = async (): Promise<IProductClient[]> => {
    const urlServer = 'http://localhost:8080/manufacturedArticle/getAll';
    const response = await fetch(urlServer, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
    });

    const data = await response.json();
    return data.map((p: any) => ({
        ...p,
        isAvailable: p.available // convierte el campo
    }));
}
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