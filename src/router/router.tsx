import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import { Routes } from './routes.ts';

export const routesConfig = createRoutesFromElements(
	<Route path="/">
		<Route index lazy={() => import('../pages/Home')} />
		<Route path={Routes.Auth} lazy={() => import('../pages/Auth')} />
	</Route>
);

export const router = createBrowserRouter(routesConfig);
