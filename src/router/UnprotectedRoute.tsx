import { storage } from '../utils';
import { Routes } from './routes.ts';
import { Outlet } from 'react-router';

export const UnprotectedRoute = () => {
	const loggedIn = storage.getItem('loggedIn') === '1';
	if (loggedIn) {
    window.location.replace(Routes.Home);
	}
  return <Outlet />;
};
