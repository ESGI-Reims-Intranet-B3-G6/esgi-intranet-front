import {
	type Article,
	useDeleteArticleMutation,
	useGetArticleQuery,
	useRequestArticleModificationsMutation,
	useValidateArticleMutation,
} from '../services/news';
import { useNavigate, useParams } from 'react-router';
import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import { FullscreenLoader } from '../components/FullscreenLoader.tsx';
import { MarkdownPreview } from '../components/MarkdownPreview.tsx';
import { format } from 'date-fns';
import { useGetUserInfoQuery, type UserInfo } from '../services';
import { type FormEvent, useLayoutEffect, useState } from 'react';
import { getApiErrorString } from '../utils';
import { Routes } from '../router';

const ArticleDetails = ({ article, user }: { article: Article, user: UserInfo }) => {
	const [verifyOpened, setVerifyOpened] = useState(false);
	const [modificationsOpened, setModificationsOpened] = useState(false);
	const [deleteOpened, setDeleteOpened] = useState(false);

	const [verifyError, setVerifyError] = useState<string | null>(null);
	const [modificationsError, setModificationsError] = useState<string | null>(null);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	const [verifyArticle, { isLoading: verifyArticleLoading }] = useValidateArticleMutation();
	const [requestArticleModifications, { isLoading: requestArticleModificationsLoading }] = useRequestArticleModificationsMutation();
	const [deleteArticle, { isLoading: deleteArticleLoading }] = useDeleteArticleMutation();

	const navigator = useNavigate();

	function handleCloseVerify() {
		setVerifyOpened(false);
	}

	function handleCloseModifications() {
		setModificationsOpened(false);
	}

	function handleCloseDelete() {
		setDeleteOpened(false);
	}

	async function handleVerify() {
		setVerifyError(null);
		const result = await verifyArticle(article.id);
		if (result.error) {
			setVerifyError(`Une erreur est survenue lors de la validation de l'article${getApiErrorString(result.error)}.`);
			return;
		}

		handleCloseVerify();
		window.location.reload();
	}

	async function handleModifications(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setModificationsError(null);
		const formData = new FormData(event.currentTarget);
		const formJson = Object.fromEntries((formData).entries());
		const modifications = formJson.modifications;
		if (!modifications) {
			setModificationsError("Une erreur est survenue lors de la récupération des modifications à demander");
			return;
		}

		const result = await requestArticleModifications({ id: article.id, modifications: modifications.toString() });
		if (result.error) {
			setModificationsError(`Une erreur est survenue lors de la demande de modifications${getApiErrorString(result.error)}.`);
			return;
		}

		handleCloseModifications();
		window.location.reload();
	}

	async function handleDelete() {
		setDeleteError(null);
		const result = await deleteArticle(article.id);
		if (result.error) {
			setDeleteError(`Une erreur est survenue lors de la suppression de l'article${getApiErrorString(result.error)}.`);
			return;
		}

		handleCloseDelete();
		navigator(Routes.News);
	}

	function handleModifyArticle() {
			navigator(Routes.EditArticle(`${article.id}`));
	}

	const actions = [
		{
			condition: user.userRole === 'SUPERADMIN',
			label: "Supprimer l'article",
			action: () => setDeleteOpened(true),
		},
		{
			condition: user.userRole === 'SUPERADMIN' && !article.publishedAt,
			label: 'Demander des modifications',
			action: () => setModificationsOpened(true),
		},
		{
			condition: user.userRole === 'SUPERADMIN' && !article.publishedAt,
			label: "Valider l'article",
			action: () => setVerifyOpened(true),
		},
		{
			condition: article.user && article.user.email === user.email && !article.publishedAt,
			label: "Modifier l'article",
			action: handleModifyArticle,
		},
	];

	return (
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
			<Typography variant="h4">{article.title}</Typography>
			<Typography variant="h6" color="lightgray" mt={1}>
				{article.user
					? `${article.user.firstName} ${article.user.lastName} - ${article.user.group}`
					: 'Utilisateur inconnu'}
			</Typography>
			<Typography
				variant="h6"
				color="darkgray"
			>{`Dernière modification : ${format(article.lastRevision, 'dd/MM/yyyy HH:mm')}`}</Typography>
			<Typography variant="h6" color="darkgray">
				{article.publishedAt
					? `Publié le : ${format(article.publishedAt, 'dd/MM/yyyy HH:mm')}`
					: 'Article en cours de validation'}
			</Typography>
			{article.modificationsRequested && (
				<Typography mt={2} variant="h6" fontStyle="italic" color="gray">
					Modifications demandées : {article.modificationsRequested}
				</Typography>
			)}
			<Divider sx={{ my: 2 }} />
			<MarkdownPreview value={article.content} />
			{actions.some(action => !!action.condition) && (
				<>
					<Divider sx={{ my: 2 }} />
					<Box display="flex" alignItems="center" justifyContent={'flex-end'} gap={2}>
						{actions.map(
							action =>
								action.condition && (
									<Button variant="outlined" sx={{ px: 2 }} onClick={action.action}>
										{action.label}
									</Button>
								)
						)}
					</Box>
				</>
			)}
			<Dialog
				open={verifyOpened}
				onClose={handleCloseVerify}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{'Confirmation de validation'}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{verifyArticleLoading ? 'Publication en cours...' : 'Voulez vous valider et publier cet article ?'}
					</DialogContentText>
					{verifyError && <Typography color="error">{verifyError}</Typography>}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseVerify}>Annuler</Button>
					<Button onClick={handleVerify} autoFocus>
						Publier
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={modificationsOpened}
				onClose={handleCloseModifications}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{'Confirmation de demande de modifications'}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{requestArticleModificationsLoading ? 'Envoi de la demande...' : 'Entrez vos modifications demandées :'}
					</DialogContentText>
					{modificationsError && <Typography color="error">{modificationsError}</Typography>}
					<form onSubmit={handleModifications} id="modifications-request-form">
						<TextField
							autoFocus
							required
							margin="dense"
							id="modifications"
							name="modifications"
							label="Modifications"
							multiline
							fullWidth
							variant="standard"
						/>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseModifications}>Annuler</Button>
					<Button type="submit" form="modifications-request-form">
						Envoyer
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={deleteOpened}
				onClose={handleCloseDelete}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{'Confirmation de suppression'}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{deleteArticleLoading ? 'Suppression en cours...' : 'Voulez vous vraiment supprimer cet article ?'}
					</DialogContentText>
					{deleteError && <Typography color="error">{deleteError}</Typography>}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDelete}>Annuler</Button>
					<Button onClick={handleDelete} autoFocus>
						Supprimer
					</Button>
				</DialogActions>
			</Dialog>
		</Paper>
	);
};

const NewsArticle = () => {
	const params = useParams();
	const { data: article, isLoading, isError } = useGetArticleQuery(params.id ? Number(params.id) : 0);
	const { data: user, isLoading: isUserInfoLoading, isError: isUserInfoError } = useGetUserInfoQuery();

	useLayoutEffect(() => {
		document.title = "Intranet ESGI | Lecture d'article";
	}, []);

	return (
		<Container>
			<FullscreenLoader loading={isLoading || isUserInfoLoading} />
			{(isError || isUserInfoError) && <Typography>Could not load the requested article.</Typography>}
			<Box m={2}>
				{!isLoading && !isUserInfoLoading && article && user && <ArticleDetails article={article} user={user} />}
			</Box>
		</Container>
	);
};

export const Component = NewsArticle;
