import {useState, useEffect, useCallback, useMemo} from 'react'

const storageListeners = Object.create(null)

const addStorageListener = (key, fn) => {
	let forKey = storageListeners[key]
	if(!forKey) storageListeners[key] = forKey = []
	forKey.push(fn)
}

const removeStorageListener = (key, fn) => {
	let forKey = storageListeners[key]
	if(!forKey) return
	let idx = forKey.indexOf(fn)
	if(idx!==-1) forKey.splice(idx, 1)
}

const sendStorageEvent = (key, val) => {
	let forKey = storageListeners[key]
	if(!forKey) return
	forKey.forEach(fn => fn(val, key))
}

window.addEventListener('storage', e => sendStorageEvent(e.key, e.newValue))

const getDefaultVal = defaultVal => typeof defaultVal==='function' ? defaultVal() : defaultVal

export default function useLocalStorageState(key, defaultVal) {
	const [val, rawSetVal] = useState(() => {
		let val = localStorage.getItem(key)
		if(defaultVal!==undefined && !val) {
			val = getDefaultVal(defaultVal)
			localStorage.setItem(key, val)
		}
		return val
	})

	const setVal = useCallback(val => {
		localStorage.setItem(key, val)
		sendStorageEvent(key, val)
	}, [key])

	useEffect(() => {
		addStorageListener(key, rawSetVal)
		return () => removeStorageListener(key, rawSetVal)
	}, [key])

	return useMemo(() => [val, setVal], [val, setVal])
}
