export const Routes = {
	Home: '/',
	Auth: '/auth',
	Login: '/login',
};

export type Route = (typeof Routes)[keyof typeof Routes];
