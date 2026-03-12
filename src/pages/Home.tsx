import { Box, Container, Paper, Typography } from '@mui/material';
import { useLayoutEffect } from 'react';

function Home() {
	useLayoutEffect(() => {
		document.title = 'Intranet ESGI | Accueil';
	}, []);

	return (
		<Container>
			<Paper
				elevation={0}
				sx={{
					my: 4,
					p: 3,
					border: '1px solid',
					borderColor: 'divider',
					borderRadius: 3,
					overflow: 'hidden',
					bgcolor: 'rgba(20, 20, 20, 1.0)',
				}}
			>
				<Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
					<Typography variant="h4">Bienvenue sur votre intranet de l'ESGI !</Typography>
					<Typography variant="h5" mt={1}>
						Utilisez les menus dans la barre de navigation afin d'accéder aux différentes fontionnalités de l'intranet
					</Typography>
					<Typography variant="h5">
						Revenez ultérieurement pour une page d'accueil <strong>améliorée</strong> !
					</Typography>
				</Box>
			</Paper>
		</Container>
	);
}

export const Component = Home;
