import React, {createContext} from 'react'

const TokenContext = createContext(null)
TokenContext.displayName = 'TokenContext'
export default TokenContext
export {TokenContext}

const SetTokenContext = createContext(null)
SetTokenContext.displayName = 'SetTokenContext'
export {SetTokenContext}

export function TokenContextProvider({token, setToken, children}) {
	return (
		<TokenContext.Provider value={token}>
			<SetTokenContext.Provider value={setToken}>
				{ children }
			</SetTokenContext.Provider>
		</TokenContext.Provider>
	)
}

