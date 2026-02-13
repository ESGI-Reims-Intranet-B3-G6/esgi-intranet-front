import './UnprotectedLayout.css';
import { Outlet } from "react-router";
import ESGILogo from '../assets/esgi.svg?react';
import SkolaeLogo from '../assets/skolae.svg?react';
import { Box, SvgIcon } from '@mui/material';

function UnprotectedLayout() {
	return (
		<>
			<Box style={{ background: '#001b40' }}>
				<SvgIcon component={ESGILogo} inheritViewBox style={{ height: '100px', width: 'auto', margin: '1rem 2rem' }} />
			</Box>
			<Outlet />
			<Box style={{ background: '#001b40', position: 'sticky', bottom: 0, display: 'flex' }}>
				<SvgIcon component={SkolaeLogo} inheritViewBox style={{ height: '50px', width: 'auto', marginLeft: 'auto', marginRight: '2rem', marginTop: '1rem', marginBottom: '1rem' }} />
			</Box>
		</>
	);
}

export const Component = UnprotectedLayout;
