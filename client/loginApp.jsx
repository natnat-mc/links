import React, {useContext, useRef} from 'react'

import Button from './button.jsx'

import {SetTokenContext} from './tokenContext.jsx'

export default function LoginApp() {
	const setToken = useContext(SetTokenContext)

	const passwordRef = useRef()

	const login = async () => {
		const password = passwordRef.current.value
		const req = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify({
				password,
				permissions: ['all']
			}),
			headers: {
				['Content-Type']: 'application/json'
			}
		})
		const res = await req.json()

		if(res.ok) {
			setToken(res.token)
		} else {
			alert(res.error)
		}
	}

	return (
		<form id="loginApp" onSubmit={e => {
			e.preventDefault()
			login()
		}}>
			<label htmlFor="password">Password</label>
			<input type="password" id="password" ref={passwordRef} />
			<Button onClick={login}>Log in</Button>
		</form>
	)
}
