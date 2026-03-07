import baseApi from '../baseApi';
import type { UserInfo } from './types';

export const usersApi = baseApi.injectEndpoints({
	endpoints: builder => ({
		getUserInfo: builder.query<UserInfo, void>({
			query: () => 'users',
		}),
	}),
});

export const { useGetUserInfoQuery } = usersApi;
