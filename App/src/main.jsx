import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
// import { disableReactDevTools } from '@fvilers/disable-react-devtools'

// if (window.process.env.NODE_ENV === 'production') {
//   disableReactDevTools();
// }

ReactDOM.createRoot(document.getElementById('root')).render(
	<AuthProvider>
		<App />
	</AuthProvider>
)
