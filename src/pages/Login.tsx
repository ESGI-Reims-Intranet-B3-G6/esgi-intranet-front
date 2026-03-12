import { env, Variables } from '../utils';
import { Button, Stack, Typography } from '@mui/material';
import { useLayoutEffect } from 'react';

function Login() {
	useLayoutEffect(() => {
		document.title = 'Intranet ESGI | Connexion';
	}, []);

	async function handleSignIn() {
		window.location.href = env(Variables.backendUrl) + '/auth/login';
	}

	return (
		<Stack style={{ backgroundImage: 'url("assets/login-bg.jpg")', height: '100vh' }}>
			<Typography className={'text-outline-black-3'} style={{ margin: '2rem auto' }} variant={'h2'}>
				ESGI Intranet
			</Typography>
			<Typography className={'text-outline-black-3'} style={{ margin: '1rem auto' }} variant={'h3'}>
				Connectez-vous pour accéder à votre intranet
			</Typography>
			<Button
				onClick={handleSignIn}
				variant={'contained'}
				size={'large'}
				style={{ maxWidth: '200px', margin: '1rem auto' }}
			>
				Se connecter
			</Button>
		</Stack>
	);
}

export const Component = Login;
