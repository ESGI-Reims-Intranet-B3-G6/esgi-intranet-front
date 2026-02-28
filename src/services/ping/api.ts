import baseApi from '../baseApi.ts';
import type { FetchArgs } from '@reduxjs/toolkit/query';

export const pingApi = baseApi.injectEndpoints({
	endpoints: builder => ({
		ping: builder.query<string, string>({
			query: name => {
				return {
					url: '',
					params: { name },
					responseHandler: 'text',
				} as FetchArgs;
			},
		}),
	}),
});

export const { useLazyPingQuery } = pingApi;
