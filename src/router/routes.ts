export const Routes = {
	Home: '/',
	Auth: '/auth',
	Login: '/login',
	Users: '/users',
	News: '/news',
	NewsArticle: (id: string) => `/news/article/${id}`,
	CreateArticle: '/news/new',
	EditArticle: (id: string) => `/news/edit/${id}`,
	Hacklab: '/hacklab',
};

export type Route = (typeof Routes)[keyof typeof Routes];
