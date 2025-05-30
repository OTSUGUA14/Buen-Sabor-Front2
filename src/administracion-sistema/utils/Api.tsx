import type { Ingrediente } from "../api/types/ISupply";

export const getInstrumentosAll = async (): Promise<Ingrediente[]> => {
	const urlServer = 'http://localhost:8080/article/getAll';
	const response = await fetch(urlServer, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		mode: 'cors'
	});
	console.log(response);
	return await response.json();
}