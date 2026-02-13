import { Navigate, useSearchParams } from 'react-router';
import { Routes } from '../router';
import { useLazyLoginCallbackQuery } from '../services/auth/api.ts';
import { useEffect } from 'react';
import { Stack, Typography } from '@mui/material';

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

  if (isSuccess) {
    window.location.replace(Routes.Home);
  }

	return (
		<>
			<Stack style={{ backgroundImage: 'url("assets/login-bg.jpg")', height: '100vh' }}>
				<Typography className={'text-outline-black-3'} style={{ margin: '2rem auto' }} variant={'h2'}>
					ESGI Intranet
				</Typography>
				<Typography className={'text-outline-black-3'} style={{ margin: '1rem auto' }} variant={'h3'}>
					{isLoading && <p>Connexion en cours...</p>}
					{isError && <p>Erreur lors de la connexion à l'intranet.</p>}
          {isSuccess && <p>Connexion réussie ! Redirection vers l'intranet...</p>}
				</Typography>
			</Stack>
		</>
	);
}

export const Component = Auth;
