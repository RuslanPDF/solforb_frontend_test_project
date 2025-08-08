import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './Store/store.js'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</Provider>
)
