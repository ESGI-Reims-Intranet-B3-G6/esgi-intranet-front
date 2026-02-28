import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import { Routes } from './routes';
import { ProtectedRoute } from './ProtectedRoute';
import { UnprotectedRoute } from "./UnprotectedRoute";

export const routesConfig = createRoutesFromElements(
	<Route path="/">
		<Route element={<ProtectedRoute />}>
			<Route lazy={() => import('../components/ProtectedLayout.tsx')}>
				<Route path={Routes.Home} lazy={() => import('../pages/Home')} />
				<Route path={Routes.Users} lazy={() => import('../pages/Users')} />
				<Route path={Routes.News} lazy={() => import('../pages/News')} />
				<Route path={Routes.Hacklab} lazy={() => import('../pages/Hacklab')} />
			</Route>
		</Route>
		<Route element={<UnprotectedRoute />}>
			<Route lazy={() => import('../components/UnprotectedLayout.tsx')}>
				<Route path={Routes.Login} lazy={() => import('../pages/Login')} />
				<Route path={Routes.Auth} lazy={() => import('../pages/Auth')} />
			</Route>
		</Route>
	</Route>
);

export const router = createBrowserRouter(routesConfig);
