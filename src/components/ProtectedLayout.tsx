import './ProtectedLayout.css';
import { NavLink, Outlet } from "react-router";
import ESGILogo from '../assets/esgi.svg?react';
import SkolaeLogo from '../assets/skolae.svg?react';
import { Box, capitalize, Container, SvgIcon, type SxProps, type Theme, Typography } from '@mui/material';
import { Routes } from "../router";
import { useGetUserInfoQuery, useLogoutMutation, type UserInfo } from '../services';
import { AccountCircle } from "@mui/icons-material";
import { useState } from "react";
import { OutsideCallbacker } from '../utils/OutsideCallbacker';

function NavbarLink(props: { url: string, label: string }) {
  return <NavLink to={props.url} style={{color: 'white', fontSize: '18px'}}>{props.label}</NavLink>
}

function AccountMenu(props: { closing: boolean, opened: boolean, userInfo?: UserInfo, userInfoLoading: boolean }) {
  const [logout, { isLoading, isSuccess, isError }] = useLogoutMutation();

  if (isSuccess || isError) {
    window.location.replace(Routes.Login);
  }

  const containerSx = {
    borderRadius: 5,
    background: 'rgba(80, 80, 80, 0.95)',
    position: 'absolute',
    top: '120px',
    right: '0',
    zIndex: 100000000,
    mr: 3,
    maxWidth: '300px',
    width: 'fit-content',
    padding: 1,
  } as SxProps<Theme>;

  const className = `${props.closing ? 'closing' : ''} ${!props.opened && !props.closing ? 'closed' : ''} ${props.opened ? 'opened' : ''}`;

  if (props.userInfoLoading) {
    return (
      <Container id="account-menu" className={className} maxWidth={false} sx={containerSx}>
        <Typography m={1} textAlign={'center'} color={'lightgray'} variant={'body2'}>
          Chargement...
        </Typography>
      </Container>
    );
  }

  if (!props.userInfo) {
    return (
      <Container id="account-menu" className={className} maxWidth={false} sx={containerSx}>
        <Typography variant={'body2'}>Erreur de récupération de l'utilisateur</Typography>
      </Container>
    );
  }

  return (
			<Container id="account-menu" className={className} maxWidth={false} sx={containerSx}>
				<Typography mb={0.5} textAlign={'center'} fontWeight={'900'}>
					{props.userInfo.firstName} {props.userInfo.lastName}
				</Typography>
				<Typography mb={0.5} textAlign={'center'} color={'lightgray'}>
					{props.userInfo.email}
				</Typography>
				<Typography mb={1} textAlign={'center'} color={'lightgray'}>
					{capitalize(props.userInfo.userRole.toLowerCase())}
				</Typography>
				{isLoading || isSuccess || isError ? (
					<Typography textAlign={'center'}>Déconnexion...</Typography>
				) : (
					<Typography
						textAlign={'center'}
						sx={{ cursor: 'pointer', textDecoration: 'underline' }}
						onClick={async () => await logout()}
					>
						Se déconnecter
					</Typography>
				)}
			</Container>
		);
}

function ProtectedLayout() {
  const [accountMenuOpened, setAccontMenuOpened] = useState(false);
  const [accountMenuClosing, setAccountMenuClosing] = useState(false);
  const animateAccountMenu = (opened: boolean) => {
    if (!opened) {
      setTimeout(() => {
        setAccountMenuClosing(false);
      }, 600)
      setAccountMenuClosing(true);
    }
    setAccontMenuOpened(opened);
  }
  const { data, isLoading: isUserInfoLoading } = useGetUserInfoQuery();

  return (
			<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
				<Box style={{ background: '#001b40' }}>
					<Container sx={{ m: 0, padding: '0 !important', display: 'flex' }} maxWidth={false}>
						<NavLink to={Routes.Home}>
							<SvgIcon component={ESGILogo} inheritViewBox style={{ height: '70px', width: 'auto', margin: '1rem 2rem' }} />
						</NavLink>
						<Container maxWidth={false} sx={{ alignItems: 'center', display: 'flex', gap: 5 }}>
							<NavbarLink url={Routes.Users} label={'Utilisateurs'} />
							<NavbarLink url={Routes.News} label={'Actualités'} />
							<NavbarLink url={Routes.Hacklab} label={'Hacklab'} />
							<Container sx={{ justifyContent: 'end', display: 'flex' }}>
								<AccountCircle
									id="account-circle"
									sx={{ fontSize: 70, cursor: 'pointer' }}
									onClick={() => animateAccountMenu(!accountMenuOpened)}
								/>
							</Container>
						</Container>
					</Container>
					<OutsideCallbacker ignore={['account-circle']} event={'mousedown'} callback={() => animateAccountMenu(false)}>
						<AccountMenu
							closing={accountMenuClosing}
							opened={accountMenuOpened}
							userInfo={data}
							userInfoLoading={isUserInfoLoading}
						/>
					</OutsideCallbacker>
				</Box>
				<Box id={'page-body'} sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
					<Outlet />
				</Box>
				<Box style={{ background: '#001b40', display: 'flex' }}>
					<SvgIcon
						component={SkolaeLogo}
						inheritViewBox
						style={{
							height: '50px',
							width: 'auto',
							marginLeft: 'auto',
							marginRight: '2rem',
							marginTop: '1rem',
							marginBottom: '1rem',
						}}
					/>
				</Box>
			</Box>
		);
}

export const Component = ProtectedLayout;
