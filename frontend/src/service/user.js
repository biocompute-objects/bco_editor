import apiCall from './http';

export const setAuthToken = token => localStorage.setItem('token', token);
export const setUserInfo = user => localStorage.setItem('user', JSON.stringify(user));
export const getAuthToken = () => localStorage.getItem('token');
export const getUserInfo = () => JSON.parse(localStorage.getItem('user'));
export const clearStorage = () => localStorage.clear();
export const checkAuthToken = () => {
	let token = getAuthToken();
	if (token && token !== 'undefined')
		return true;
	return false;
}

export const login = async(username, password) => {
    let url = '/api/auth/login/';
    let result = await apiCall({
        url,
        method: 'POST',
        body: {
            username,
            password
        },
        isAuth: false
    })
    return result;
}

export const signUp = async (user) => {
    let url = '/api/user/'
    let result = await apiCall({
        url,
        method: 'POST',
        body: {...user,
            first_name: user.firstName,
            last_name: user.last_name, 
            profile:{}},
        isAuth: false,
        headers: {
            'Authorization': 'Token fa4353623da5987e3d143ad3cb5c5836caa84a58'
        }
    });
    return result;
}

export const logout = async() => {
	clearStorage();
    let url = '/api/auth/logout/'
    let result = await apiCall({
        url
    });
    return result;
}

export const updateAccount = async(data, id) => {
    let url = `/api/user/${id}/`;
    let result = await apiCall({
        url,
        method: 'PUT',
        body: {...data, password: '123' }
    });
    return result;
}

export const updatePassword = async(password) => {
    let url = `/api/user/change_password/`;
    let result = await apiCall({
        url,
        method: 'POST',
        body: { password }
    });
    return result;
}

export const getUserDetail = async () => {
	let url = `/api/user/detail_info/`;
	let result = await apiCall({
		url
	})
	return result;
}

export const getUserList = async () => {
	let url = '/api/user';
	let result = await apiCall({ url });
	return result;
}