import {useContext, useEffect, useState} from 'react'

import apiCall from './apiCall.jsx'
import TokenContext from './tokenContext.jsx'

const apiCallCache = Object.create(null)
const cachedCall = async (path, token) => {
	if(apiCallCache[path]) return apiCallCache[path]
	const data = await apiCall(path, token, 'GET')
	apiCallCache[path] = data
	return data
}

const invalidationHandlers = Object.create(null)
const addInvalidationHandlers = (path, fn) => {
	if(!invalidationHandlers[path]) invalidationHandlers[path] = []
	invalidationHandlers[path].push(fn)
}
const removeInvalidationHandlers = (path, fn) => {
	if(!invalidationHandlers[path]) return
	const idx = invalidationHandlers[path].indexOf(fn)
	if(idx) invalidationHandlers[path].splice(idx, 1)
}
const invalidateCache = (path=null) => {
	if(path===null) {
		Object.keys(apiCallCache).forEach(key => {
			delete apiCallCache[key]
			invalidationHandlers[key]?.forEach(fn => fn())
		})
	} else {
		delete apiCallCache[path]
		invalidationHandlers[path]?.forEach(fn => fn())
	}
}

export default function useApiCall(path, cache) {
	const token = useContext(TokenContext)
	const [value, setValue] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		const dewit = () => {
			setValue(null)
			apiCall(path, token, 'GET').then(setValue).catch(setError)
		}
		dewit()
		addInvalidationHandlers(path, dewit)
		return () => removeInvalidationHandlers(path, dewit)
	}, [path])

	if(error) throw error
	return value
}

export {invalidateCache}
