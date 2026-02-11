import '../App.css';
import { Navigate, useSearchParams } from 'react-router';
import { Routes } from '../router';
import { useLazyLoginCallbackQuery } from '../services/auth/api.ts';
import { useEffect } from 'react';

function Auth() {
	const [searchParams, _setSearchParams] = useSearchParams();
	const [loginCallback, { isLoading, isError, isSuccess }] = useLazyLoginCallbackQuery();

	useEffect(() => {
		if (!searchParams.has('code') || !searchParams.has('session_state')) {
			return;
		}

		loginCallback({
			code: searchParams.get('code')!,
			sessionState: searchParams.get('session_state')!,
		});
	}, [loginCallback, searchParams]);

	if (!searchParams.has('code') || !searchParams.has('session_state')) {
		return <Navigate to={{ pathname: Routes.Home }} />;
	}

	return (
		<>
			{isLoading && <p>Logging in...</p>}
			{isError && <p>Error</p>}
			{isSuccess && <Navigate to={Routes.Home} />}
		</>
	);
}

export const Component = Auth;
