import React, {useContext} from 'react'

import Button from './button.jsx'

import {invalidateCache} from './useApiCall.jsx'
import apiCall from './apiCall.jsx'
import TokenContext from './tokenContext.jsx'

export default function EditLinkButton({name, current}) {
	const token = useContext(TokenContext)

	const edit = async () => {
		const newDest = prompt("New target for "+name, current)
		if(newDest == current || !newDest) return
		try {
			await apiCall('/links/'+encodeURIComponent(name), token, 'PUT', {link: newDest})
			invalidateCache('/links')
		} catch(e) {
			alert(e)
		}
	}

	return <Button onClick={edit}>edit</Button>
}
