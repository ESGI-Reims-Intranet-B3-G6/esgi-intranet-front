import baseApi from '../baseApi';
import type { FetchArgs } from '@reduxjs/toolkit/query';
import { storage } from '../../utils';
import type { LoginCallbackRequest } from './types';

export const authApi = baseApi.injectEndpoints({
	endpoints: builder => ({
		loginCallback: builder.mutation<void, LoginCallbackRequest>({
			query: ({ code, sessionState }) => {
				return {
					url: 'auth/microsoft',
					params: { code, session_state: sessionState },
				} as FetchArgs;
			},
			onQueryStarted(_arg, { queryFulfilled }): Promise<void> | void {
				// When the query completes successfully, persist the fact that the user is logged in
				queryFulfilled.then(_result => {
					storage.setItem('loggedIn', '1');
				});
			},
		}),
		logout: builder.mutation<void, void>({
			query: () => 'auth/logout',
			onQueryStarted(_arg, { queryFulfilled }): Promise<void> | void {
				// When the query completes successfully, persist the fact that the user is logged out
				queryFulfilled.then(_result => {
					storage.setItem('loggedIn', '0');
				});
			},
		}),
		getUserInfo: builder.query<object, void>({
			query: () => 'auth/test',
		}),
	}),
});

export const { useLoginCallbackMutation, useLogoutMutation, useGetUserInfoQuery } = authApi;
