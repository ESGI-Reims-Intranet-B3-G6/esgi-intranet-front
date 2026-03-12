import {
	Badge,
	Button,
	capitalize,
	ClickAwayListener,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
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
	useGridSelector,
	gridRowSelectionStateSelector,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
	type Role,
	RolesList,
	useCreateUserMutation,
	useDisableUsersMutation,
	useGetUserInfoQuery,
	useGetUsersQuery,
	type UserInfo,
	useUpdateUsersMutation,
} from '../services';
import { Navigate } from "react-router";
import { Routes } from "../router";
import { FullscreenLoader } from "../components/FullscreenLoader.tsx";
import { useRef, useState, type FormEvent, type KeyboardEvent, type RefObject, useLayoutEffect } from 'react';
import { format } from "date-fns";
import type { GridApiCommon } from "@mui/x-data-grid";

const UsersListToolbarAdd = ({ apiRef }: { apiRef: RefObject<GridApiCommon> }) => {
	const [newPanelOpen, setNewPanelOpen] = useState(false);
	const newPanelTriggerRef = useRef<HTMLButtonElement>(null);
	const [addRole, setAddRole] = useState<Role>('ETUDIANT');
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
		errorString = ': ';
		if ('status' in error) {
			errorString += 'error' in error ? (error as { error: string }).error : (error.data as { message: string })?.message;
		} else {
			errorString += error.message;
		}
	}

	return (
		<>
			<Tooltip title="Ajouter un utilisateur">
				<ToolbarButton ref={newPanelTriggerRef} aria-describedby="new-panel" onClick={() => setNewPanelOpen(prev => !prev)}>
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
								{isLoading ? (
									<Button type="submit" variant="contained" fullWidth disabled>
										Ajout de l'utilisateur...
									</Button>
								) : (
									<Button type="submit" variant="contained" fullWidth>
										Ajouter l'utilisateur
									</Button>
								)}
							</Stack>
						</form>
					</Paper>
				</ClickAwayListener>
			</Popper>
		</>
	);
};

const UsersListToolbarEdit = ({
	apiRef,
  users,
}: {
	apiRef: RefObject<GridApiCommon>;
	users: UserInfo[];
}) => {
	const [newPanelOpen, setNewPanelOpen] = useState(false);
	const newPanelTriggerRef = useRef<HTMLButtonElement>(null);
	const [NewRole, setNewRole] = useState<Role>('ETUDIANT');
  const selection = useGridSelector(apiRef, gridRowSelectionStateSelector);
	const [updateUsers, { isLoading, isError, error }] = useUpdateUsersMutation();

  const selectedRowIds = selection.type === 'include' ? Array.from(selection.ids) : [];

	const handleClose = () => {
		setNewPanelOpen(false);
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		const editedUsers = users.filter(user => selectedRowIds.includes(user.email));

		const userRole = formData.get('userRole') as Role;
    const group = formData.get('group') as string;

		const response = await updateUsers({
			users: editedUsers.map(user => {
				return { email: user.email };
			}),
			userRole,
			group,
		});

		if (!response.error) {
      const updates = editedUsers.map(user => {
        return {
          ...user,
          userRole,
          group,
        };
      });
			updates.forEach((update) => apiRef.current.updateRows([update]));
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
		errorString = ': ';
		if ('status' in error) {
			errorString += 'error' in error ? (error as { error: string }).error : (error.data as { message: string })?.message;
		} else {
			errorString += error.message;
		}
	}

	const isMultipleSelected = selectedRowIds.length > 1;
  const modifyUserText = `Modifier ${isMultipleSelected ? 'des' : 'un'} utilisateur${isMultipleSelected ? 's' : ''}`;
  const modifyUserButtonText = `Modifier ${isMultipleSelected ? `${selectedRowIds.length} ` : "l'"}utilisateur${isMultipleSelected ? 's' : ''}`;
  const modifyUserButtonLoadingText = `Modification de ${isMultipleSelected ? `${selectedRowIds.length} ` : "l'"}utilisateur${isMultipleSelected ? 's' : ''}`;

	return (
		<>
			<Tooltip title={modifyUserText}>
				<ToolbarButton
					disabled={selectedRowIds.length === 0}
					ref={newPanelTriggerRef}
					aria-describedby="new-panel"
					onClick={() => setNewPanelOpen(prev => !prev)}
				>
					<EditIcon fontSize="small" />
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
						<Typography fontWeight="bold">{modifyUserText}</Typography>
						{isError && <Typography>Erreur lors de la modification{errorString}</Typography>}
						<form onSubmit={handleSubmit}>
							<Stack spacing={2}>
								<TextField label="Groupe" name="group" size="small" autoFocus fullWidth required />
								<FormControl>
									<InputLabel id="role-select-label">Rôle</InputLabel>
									<Select
										onChange={e => setNewRole(e.target.value as Role)}
										labelId="role-select-label"
										label="Rôle"
										name="userRole"
										size="small"
										value={NewRole}
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
								{isLoading ? (
									<Button type="submit" variant="contained" fullWidth disabled>
										{modifyUserButtonLoadingText}
									</Button>
								) : (
									<Button type="submit" variant="contained" fullWidth>
										{modifyUserButtonText}
									</Button>
								)}
							</Stack>
						</form>
					</Paper>
				</ClickAwayListener>
			</Popper>
		</>
	);
};

const UsersListToolbarRemove = ({
  apiRef,
  users,
}: {
  apiRef: RefObject<GridApiCommon>;
  users: UserInfo[];
}) => {
  const [open, setOpen] = useState(false);
  const selection = useGridSelector(apiRef, gridRowSelectionStateSelector);
  const [disableUsers, { isLoading, isError }] = useDisableUsersMutation();
  const selectedRowIds = selection.type === 'include' ? Array.from(selection.ids) : [];
  const isMultipleSelected = selectedRowIds.length > 1;

  useLayoutEffect(() => {
    document.title = 'Intranet ESGI | Gestion des utilisateurs';
  }, []);

  const handleDelete = async () => {
    const editedUsers = users.filter(user => selectedRowIds.includes(user.email));

    const response = await disableUsers({
      users: editedUsers.map(user => {
        return { email: user.email };
      }),
    });

    if (response.error) {
      let errorString: string = '';
      if (isError) {
        errorString = ': ';
        if ('status' in response.error) {
          errorString +=
            'error' in response.error
              ? (response.error as { error: string }).error
              : (response.error.data as { message: string })?.message;
        } else {
          errorString += response.error.message;
        }
      }

      alert(`Une erreur est survenue lors de la suppression des utilisateurs${errorString}.`)
      handleClose();
      return;
    }

    const updates = editedUsers.map(user => {
      return {
        email: user.email,
        _action: 'delete' as const
      };
    });
    updates.forEach(update => apiRef.current.updateRows([update]));
    handleClose();
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
			<>
				<Tooltip title={'Supprimer'}>
					<ToolbarButton disabled={selectedRowIds.length === 0} onClick={handleClickOpen}>
						<RemoveIcon fontSize="small" />
					</ToolbarButton>
				</Tooltip>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{'Confirmation de suppression'}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{isLoading
								? 'Suppression en cours...'
								: `Voulez vous vraiment supprimer ${selectedRowIds.length} utilisateur${isMultipleSelected ? 's' : ''} ?`}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Annuler</Button>
						<Button onClick={handleDelete} autoFocus>
							Supprimer
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
};

const UsersListToolbar = (props: { users: UserInfo[] }) => {
  const apiRef = useGridApiContext();

  return (
			<Toolbar>
				<Typography fontWeight="medium" sx={{ flex: 1, mx: 0.5 }}>
					Gestion des utilisateurs
				</Typography>

				<UsersListToolbarEdit apiRef={apiRef} users={props.users} />
				<UsersListToolbarAdd apiRef={apiRef} />
				<UsersListToolbarRemove apiRef={apiRef} users={props.users} />

				<Tooltip title="Colonnes">
					<ColumnsPanelTrigger render={<ToolbarButton />}>
						<ViewColumnIcon fontSize="small" />
					</ColumnsPanelTrigger>
				</Tooltip>

				<Tooltip title="Filtres">
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
				field: 'group',
				headerName: 'Groupe',
				editable: false,
			},
			{
				field: 'lastLogin',
				headerName: 'Dernière connexion',
				editable: false,
				valueGetter: value => (value ? format(value, 'dd/MM/yyyy HH:mm:ss') : 'Jamais'),
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
      slots={{ toolbar: () => <UsersListToolbar users={props.users} /> }}
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
        <Typography fontSize={14} mt={2} textAlign="center" sx={{ color: 'lightgray', fontStyle: 'italic' }}>Note: Afin de modifier les champs 'Email', 'Prénom' et 'Nom', veuillez modifier l'utilisateur Microsoft directement.</Typography>
			</Container>
		); 
}

export const Component = Users;
