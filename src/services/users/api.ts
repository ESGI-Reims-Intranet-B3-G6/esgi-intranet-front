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
	}),
});

export const { useGetUserInfoQuery, useGetUsersQuery, useCreateUserMutation } = usersApi;
