import { env, storage, Variables } from '../utils';
import { Routes } from "./routes.ts";
import { Outlet } from "react-router";

export const ProtectedRoute = () => {
	const loggedIn = storage.getItem('loggedIn') === '1';
  if (!loggedIn && env(Variables.debugProtectedRoute) !== 'true') {
    window.location.replace(Routes.Login);
  }
  return <Outlet />;
};
