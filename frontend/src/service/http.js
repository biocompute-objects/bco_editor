export default async function apiCall({
    url,
    method = 'GET',
    body = {},
    headers = {},
    isAuth = true
}) {
    if (isAuth)
        headers['Authorization'] = 'Token ' + window.localStorage.getItem('token')

    let params = {
        method,
        headers
    }
    let res = null
    let status = null
    try {
        if (method !== 'GET') {
            params.body = JSON.stringify(body)
            if (!headers['Content-Type'])
                headers['Content-Type'] = 'application/json'
            if (headers['Content-Type'] === 'auto')
                delete headers['Content-Type']
        }
        res = await fetch(url, params);
        status = res.status;
        if (status === 200) {
        	res = await res.json();
        } else {
        	res = await res.json();
        }
    	res = { result: res, status}
    } catch (e) {
        console.log(e)
        let errText = res || 'Something went wrong!'
        console.log(e, res, errText)
    }

    return res
}