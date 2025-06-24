// Update the path below to the correct relative path to IProductClient
import type { Category, IProductClient } from '../../cliente/types/IProductClient';
import type { IArticle } from "../api/types/IArticle";

import type { } from "../api/types/IProduct";

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

export const setIngredientes = async (ingredientes: any): Promise<IArticle> => {
	const urlServer = 'http://localhost:8080/article/add';
	const response = await fetch(urlServer, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(ingredientes),
		mode: 'cors'
	});
	console.log(ingredientes);

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
export const getMeasuringUnitsAll = async (): Promise<any[]> => {
	const urlServer = 'http://localhost:8080/measuringUnit/getAll';
	const response = await fetch(urlServer, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		mode: 'cors'
	});
	return await response.json();
};



export const loginEmploye = async (employee: any): Promise<string> => {
	const urlServer = 'http://localhost:8080/employee/login';
	const response = await fetch(urlServer, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(employee),
		mode: 'cors'
	});
	return await response.text(); // <-- aquí el cambio
}