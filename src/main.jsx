import React from 'react';
import ReactDOM from 'react-dom/client';
import { configure, observable } from 'mobx';
import { QueryClientProvider, QueryClient } from 'react-query';

import model from './models/model.js';
import App from './App.jsx';

import "./style/main.scss"

configure({ enforceActions: 'never' });
const reactiveModel = observable(model);
window.model = reactiveModel

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			retry: false,
		},
	},
});

ReactDOM.createRoot(document.getElementById('root')).render(
	<QueryClientProvider client={queryClient}>
		<App model={reactiveModel} />
	</QueryClientProvider>,
);
