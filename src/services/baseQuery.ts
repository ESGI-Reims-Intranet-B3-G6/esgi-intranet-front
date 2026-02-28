import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import { env, storage, Variables } from '../utils';

type Error = { message?: string; status?: number; details?: { cause?: string } };

const rawBaseQuery = () =>
	fetchBaseQuery({
		baseUrl: `${env(Variables.backendUrl)}/`,
		credentials: 'include',
		responseHandler: 'json',
	});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const baseQuery = async (args: any, api: BaseQueryApi, extraOptions: Record<string, any>) => {
	let result = await rawBaseQuery()(args, api, extraOptions);

	const error: Error | null = result.error?.data ?? null;
	if (error && (error.details?.cause === 'No auth token' || error.details?.cause === 'jwt expired')) {
		if (storage.getItem('loggedIn') !== '1') {
			return result;
		}

		console.log('Refreshing token...');
		const refreshReponse = await fetch(env(Variables.backendUrl) + '/auth/refresh', { credentials: 'include' });
		if (refreshReponse.ok) {
			// Retrying the original request...
			result = await rawBaseQuery()(args, api, extraOptions);
		} else {
			console.error('Error when refreshing token: ', error);
			console.log('Logging out user...');
			storage.setItem('loggedIn', '0');
			window.location.reload();
		}
	}

	if (error && error.message === 'User is disabled') {
		console.error('Error while performing request: ', error);
		console.log('Logging out user...');
		if (storage.getItem('loggedIn') !== '0') {
			storage.setItem('loggedIn', '0');
			window.location.reload();
		}
	}

	return result;
};
