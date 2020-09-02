import React, {useRef, useContext} from 'react'

import LogoutButton from './logoutButton.jsx'
import LinkList from './linkList.jsx'

import apiCall from './apiCall.jsx'
import useApiCall, {invalidateCache} from './useApiCall.jsx'
import TokenContext from './tokenContext.jsx'

export default function MainApp() {
	const token = useContext(TokenContext)

	const fixedUrl = useApiCall('/fixedUrl')?.url

	return (<>
		<h2>Link list</h2>
		<LinkList />
		<LogoutButton />
	</>)
}
