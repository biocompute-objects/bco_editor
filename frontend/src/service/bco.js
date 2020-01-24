import apiCall from './http';

// get all bco list
// search by option
export const getBcoList = async (option) => {
	let url = '/api/bco/';
	let result = await apiCall({url});
	return result;
}

// get bco by detail
export const getBcoById = async (id) => {
	let url = `/api/bco/${id}/`;
	let result = await apiCall({url});
	return result;
}

// get form schema with bco data
export const getBcoFormById = async () => {

}

// create new bco data
export const createBco = async (data) => {
	let url = `/api/bco/`;
	let result = await apiCall({
		url,
		body: data,
		method: "POST",
	})
	return result;
}

// update bco data by id
export const updateBcoById = async (data, id) => {
	let url = `/api/bco/${id}/`;
	let result = await apiCall({
		url,
		body: data,
		method: "PUT",
	})
	return result;
}

// share bco data by id
export const shareBcoById = async (data, id) => {

}