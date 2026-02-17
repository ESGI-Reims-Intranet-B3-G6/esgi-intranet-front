import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import baseApi from "./services";

createRoot(document.getElementById('root')!).render(
	<StrictMode>
    <ApiProvider api={baseApi}>
			<App />
    </ApiProvider>
	</StrictMode>
);
