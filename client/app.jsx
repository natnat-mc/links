import React from 'react'
import ReactDOM from 'react-dom'

import Header from './header.jsx'
import Footer from './footer.jsx'
import MainApp from './mainApp.jsx'
import LoginApp from './loginApp.jsx'

import {TokenContextProvider} from './tokenContext.jsx'
import useLocalStorageState from './useLocalStorageState.jsx'

function App() {
	const [token, setToken] = useLocalStorageState('token');

	return (<>
		<TokenContextProvider token={token} setToken={setToken}>
			<Header />
			<main>
				{ token
					? <MainApp />
					: <LoginApp />
				}
		</main>
			<Footer />
		</TokenContextProvider>
	</>)
}

ReactDOM.render(<App />, document.body)
