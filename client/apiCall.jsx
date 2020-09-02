export default async function apiCall(path, token, method='GET', body=undefined, headers={}) {
	if(method=='GET' || method=='HEAD' || body===undefined || body===null) {
		body = undefined
	} else if(typeof body==='object') {
		body = JSON.stringify(body)
		headers['Content-Type'] = headers['Content-Type'] || 'application/json'
	} else {
		body = ''+body
	}

	if(!path.startsWith('/')) path = '/'+path
	if(!path.startsWith('/api')) path = '/api'+path
	headers['Token'] = headers['Token'] || token

	const req = await fetch(path, {
		method,
		body,
		headers
	})

	const res = await req.json()

	if(!res.ok) throw new Error(res.error)
	return res
}
