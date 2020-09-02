import React, {useRef, useContext} from 'react'

import Button from './button.jsx'

import {invalidateCache} from './useApiCall.jsx'
import apiCall from './apiCall.jsx'
import TokenContext from './tokenContext.jsx'

export default function AddLinkRow({links, fixedUrl}) {
	const token = useContext(TokenContext)
	const nameRef = useRef()
	const urlRef = useRef()

	const add = async () => {
		const name = nameRef.current.value
		const url = urlRef.current.value

		if(links[name] && !confirm("Link already exists, replace it?")) return

		try {
			await apiCall('/links/'+encodeURIComponent(name), token, 'PUT', {link: url})
			nameRef.current.value = ''
			urlRef.current.value = ''
			invalidateCache('/links')
		} catch(e) {
			alert(e)
		}
	}

	return (
		<tr>
			<td><input ref={nameRef} type="text" />{ fixedUrl }</td>
			<td><input ref={urlRef} type="text" /></td>
			<td><Button onClick={add}>add</Button></td>
		</tr>
	)
}
