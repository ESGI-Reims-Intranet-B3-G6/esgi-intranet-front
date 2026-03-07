import {
	Badge,
	Button,
	capitalize,
	ClickAwayListener,
	Container, FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Popper,
	Select,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import {
	ColumnsPanelTrigger,
	DataGrid,
	FilterPanelTrigger,
	Toolbar,
	ToolbarButton,
	useGridApiContext,
	type GridColDef,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
	type Role,
	RolesList,
	useCreateUserMutation,
	useGetUserInfoQuery,
	useGetUsersQuery,
	type UserInfo,
} from '../services';
import { Navigate } from "react-router";
import { Routes } from "../router";
import { FullscreenLoader } from "../components/FullscreenLoader.tsx";
import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import {format} from "date-fns";

const UsersListToolbar = () => {
  const apiRef = useGridApiContext();
  const [newPanelOpen, setNewPanelOpen] = useState(false);
  const newPanelTriggerRef = useRef<HTMLButtonElement>(null);
  const [addRole, setAddRole] = useState<Role>('ETUDIANT')
  const [createUser, { isLoading, isError, error }] = useCreateUserMutation();

  const handleClose = () => {
    setNewPanelOpen(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const userResponse = await createUser({
      email: formData.get('email') as string,
      userRole: formData.get('userRole') as Role,
    });

    if (userResponse.data) {
      apiRef.current.updateRows([userResponse.data]);
      handleClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  let errorString: string = '';
  if (isError) {
    errorString = ': '
    if ('status' in error) {
      errorString += 'error' in error ? (error as { error: string }).error : (error.data as { message: string })?.message;
    } else {
      errorString += error.message;
    }
  }

  return (
			<Toolbar>
				<Typography fontWeight="medium" sx={{ flex: 1, mx: 0.5 }}>
					Gestion des utilisateurs
				</Typography>

				<Tooltip title="Ajouter un utilisateur">
					<ToolbarButton
						ref={newPanelTriggerRef}
						aria-describedby="new-panel"
						onClick={() => setNewPanelOpen(prev => !prev)}
					>
						<AddIcon fontSize="small" />
					</ToolbarButton>
				</Tooltip>

				<Popper
					open={newPanelOpen}
					anchorEl={newPanelTriggerRef.current}
					placement="bottom-end"
					id="new-panel"
					onKeyDown={handleKeyDown}
				>
					<ClickAwayListener onClickAway={handleClose} mouseEvent={'onMouseUp'}>
						<Paper
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
								width: 300,
								p: 2,
							}}
							elevation={8}
						>
							<Typography fontWeight="bold">Ajouter un utilisateur</Typography>
              {isError && <Typography>Erreur lors de l'ajout de l'utilisateur{errorString}</Typography>}
							<form onSubmit={handleSubmit}>
								<Stack spacing={2}>
									<TextField label="Email" type="email" name="email" size="small" autoFocus fullWidth required />
									<FormControl>
										<InputLabel id="role-select-label">Rôle</InputLabel>
										<Select
											onChange={e => setAddRole(e.target.value as Role)}
											labelId="role-select-label"
											label="Rôle"
											name="userRole"
											size="small"
											value={addRole}
											fullWidth
											required
										>
											{RolesList.map(role => {
												return (
													<MenuItem key={role} value={role}>
														{capitalize(role.toLowerCase())}
													</MenuItem>
												);
											})}
										</Select>
									</FormControl>
                  {
                    isLoading ? <Button type="submit" variant="contained" fullWidth disabled>
                      Ajout de l'utilisateur...
                    </Button> : <Button type="submit" variant="contained" fullWidth>
                      Ajouter l'utilisateur
                    </Button>
                  }
								</Stack>
							</form>
						</Paper>
					</ClickAwayListener>
				</Popper>

				<Tooltip title="Columns">
					<ColumnsPanelTrigger render={<ToolbarButton />}>
						<ViewColumnIcon fontSize="small" />
					</ColumnsPanelTrigger>
				</Tooltip>

				<Tooltip title="Filters">
					<FilterPanelTrigger
						render={(props, state) => (
							<ToolbarButton {...props} color="default">
								<Badge badgeContent={state.filterCount} color="primary" variant="dot">
									<FilterListIcon fontSize="small" />
								</Badge>
							</ToolbarButton>
						)}
					/>
				</Tooltip>
			</Toolbar>
		);
}

const UsersList = (props: { users: UserInfo[] }) => {
  const columns: GridColDef[] = [
			{ field: 'email', headerName: 'Email', editable: false },
			{ field: 'firstName', headerName: 'Prénom', editable: false },
			{ field: 'lastName', headerName: 'Nom', editable: false },
			{
				field: 'userRole',
				headerName: 'Rôle',
				editable: false,
				valueGetter: (value: string) => capitalize(value.toLowerCase()),
			},
			{
				field: 'id',
				headerName: 'Groupe',
				editable: false,
			},
			{
				field: 'lastLogin',
				headerName: 'Dernière connexion',
				editable: false,
				valueGetter: value => (value ? format(value, 'dd/MM/yyyy HH:mm:ss') : 'Jamais'),
			},
			{
				field: 'disabledAt',
				headerName: 'Désactivé le',
				editable: false,
				valueGetter: value => (value ? format(value, 'dd/MM/yyyy HH:mm:ss') : 'Actif'),
			},
		];

  return (
    <DataGrid
      label={'Gestion des utilisateurs'}
      rows={props.users}
      columns={columns}
      // TODO: Change this to the user ID instead of the email whenever the ID becomes non nullable in the backend
      getRowId={(row) => row.email}
      initialState={{
        sorting: {
          sortModel: [{ field: 'email', sort: 'asc' }],
        },
      }}
      autosizeOnMount
      autosizeOptions={{ expand: true, includeOutliers: true }}
      checkboxSelection
      disableRowSelectionOnClick
      showToolbar
      slots={{ toolbar: UsersListToolbar }}
    />
  );
}

const Users = () => {
  const { data: userInfo, isLoading: isUserInfoLoading } = useGetUserInfoQuery();
  const { data, isLoading, isError } = useGetUsersQuery();

  const shouldRedirect = userInfo && userInfo.userRole !== 'ADMIN' && userInfo.userRole !== 'SUPERADMIN';

  return (
			<Container sx={{ mt: 4 }}>
        <FullscreenLoader loading={isUserInfoLoading || isLoading} />
        { shouldRedirect && <Navigate to={Routes.Home} /> }
        { isError && <Typography>Une erreur s'est produite.</Typography> }
        { !isError && !isLoading && <UsersList users={data!} /> }
			</Container>
		); 
}

export const Component = Users;
