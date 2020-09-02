import React, {useContext} from 'react'

import Button from './button.jsx'

import {invalidateCache} from './useApiCall.jsx'
import apiCall from './apiCall.jsx'
import TokenContext from './tokenContext.jsx'

export default function RemoveLinkButton({name}) {
	const token = useContext(TokenContext)

	const remove = async () => {
		if(!confirm("Really remove "+name)) return
		try {
			await apiCall('/links/'+encodeURIComponent(name), token, 'DELETE')
			invalidateCache('/links')
		} catch(e) {
			alert(e)
		}
	}

	return <Button onClick={remove}>remove</Button>
}
