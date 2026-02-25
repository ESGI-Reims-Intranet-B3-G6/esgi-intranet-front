import './FullscreenLoader.css';
import ESGILogo from '../assets/esgi.svg?react';
import { Box, Container, styled, SvgIcon } from '@mui/material';
import { ScaleLoader } from "react-spinners";

const LoaderStyle = styled(Box)(() => ({
	position: 'absolute',
	top: 0,
	left: 0,
}));

export const FullscreenLoader = (props: {loading: boolean, background?: string}) => {
  const background = props.background || 'rgba(0, 0, 0, 0.9)';
	return (
		<LoaderStyle
      id={'FullscreenLoader'}
			display={'flex'}
			alignItems={'center'}
			justifyContent={'center'}
			width={'100%'}
			height={'100%'}
			sx={{ background, opacity: props.loading ? '1' : '0', zIndex: props.loading ? '1' : '-99999' }}
		>
			<Container>
				<SvgIcon component={ESGILogo} inheritViewBox style={{ height: '100px', width: 'auto', marginBottom: '2rem' }} />
				<ScaleLoader color={'#008AFF'} width={8} height={40} />
			</Container>
		</LoaderStyle>
	);
};