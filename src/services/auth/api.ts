// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { setHello, setUserInfo } from '../../store/auth/slice.ts';
import { baseQuery } from '../baseQuery.ts';
import { storage } from '../../utils';

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery,
	endpoints: builder => ({
		getHelloByName: builder.query<string, string>({
			query: name => `?name=${name}`,
			onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				queryFulfilled.then(result => {
					dispatch(setHello(result.data));
				});
			},
		}),
		loginCallback: builder.query<void, { code: string; sessionState: string }>({
			query: args => `/auth/microsoft?code=${args.code}&session_state=${args.sessionState}`,
			onQueryStarted(_arg, { queryFulfilled }): Promise<void> | void {
				queryFulfilled.then(_result => {
					storage.setItem('loggedIn', '1');
				});
			},
		}),
		logout: builder.query<void, void>({
			query: () => '/auth/logout',
			onQueryStarted(_arg, { queryFulfilled }): Promise<void> | void {
				queryFulfilled.then(_result => {
					storage.setItem('loggedIn', '0');
				});
			},
		}),
		getUserInfo: builder.query<object, void>({
			query: () => '/auth/test',
			onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				queryFulfilled.then(result => {
					dispatch(setUserInfo(result.data));
				});
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetHelloByNameQuery,
	useLazyGetHelloByNameQuery,
	useLazyLoginCallbackQuery,
	useLazyLogoutQuery,
	useGetUserInfoQuery,
} = authApi;
