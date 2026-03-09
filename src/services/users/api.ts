import baseApi from '../baseApi';
import type { Role, UserInfo } from './types';
import type { FetchArgs } from '@reduxjs/toolkit/query';

export const usersApi = baseApi.injectEndpoints({
	endpoints: builder => ({
		getUserInfo: builder.query<UserInfo, void>({
			query: () => 'users',
		}),
		getUsers: builder.query<UserInfo[], void>({
			query: () => 'users/list',
		}),
		createUser: builder.mutation<UserInfo, { email: string; userRole: Role }>({
			query: body => {
				return {
					url: 'users',
					method: 'POST',
					body,
				} as FetchArgs;
			},
		}),
		updateUsers: builder.mutation<void, { users: { email: string }[]; group: string; userRole: Role }>({
			query: body => {
				return {
					url: 'users',
					method: 'PUT',
					body,
				} as FetchArgs;
			},
		}),
		disableUsers: builder.mutation<void, { users: { email: string }[] }>({
			query: body => {
				return {
					url: 'users/disable',
					method: 'PUT',
					body,
				} as FetchArgs;
			},
		}),
	}),
});

export const {
	useGetUserInfoQuery,
	useGetUsersQuery,
	useCreateUserMutation,
	useUpdateUsersMutation,
	useDisableUsersMutation,
} = usersApi;
