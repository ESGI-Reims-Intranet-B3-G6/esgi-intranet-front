export const Routes = {
	Home: '/',
	Auth: '/auth',
	Login: '/login',
	Users: '/users',
	News: '/news',
	Hacklab: '/hacklab',
};

export type Route = (typeof Routes)[keyof typeof Routes];
