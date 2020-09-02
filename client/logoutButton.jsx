import React, {useContext} from 'react'

import Button from './button.jsx'

import TokenContext, {SetTokenContext} from './tokenContext.jsx'
import apiCall from './apiCall.jsx'

export default function LogoutButton() {
	const token = useContext(TokenContext)
	const setToken = useContext(SetTokenContext)

	const logout = async () => {
		try {
			await apiCall('/logout', token, 'POST', {})
			setToken('')
		} catch(e) {
			alert(e)
		}
	}

	return (<Button onClick={logout}>Log out</Button>)
}
