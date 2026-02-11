export const Routes = {
	Home: '/',
	Auth: '/auth',
};

export type Route = (typeof Routes)[keyof typeof Routes];
