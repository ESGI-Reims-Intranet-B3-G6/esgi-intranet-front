import { Box, Container, Paper, Typography } from '@mui/material';
import { useLayoutEffect } from 'react';

const Hacklab = () => {
  useLayoutEffect(() => {
    document.title = 'Intranet ESGI | Hacklab';
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
					<Typography variant="h4">Hacklab</Typography>
					<Typography variant="h5" mt={1}>Le hacklab est en cours de construction!</Typography>
					<Typography variant="h5">Merci de revenir ultérieurement.</Typography>
				</Box>
			</Paper>
		</Container>
	);
};

export const Component = Hacklab;
