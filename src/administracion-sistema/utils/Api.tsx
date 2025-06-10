import type { IProductClient } from "../../type/IProductClient";
import type { IIngrediente } from "../api/types/IIngrediente";
import type { IProduct } from "../api/types/IProduct";

export const getIngredientesAll = async (): Promise<IIngrediente[]> => {
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



export const getProductsAll = async (): Promise<[IProductClient]> => {
	const urlServer = 'http://localhost:8080/manufacturedArticle/getAll';
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