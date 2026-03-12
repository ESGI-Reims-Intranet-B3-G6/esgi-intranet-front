import { Box, Typography, Container, TextField, Paper, Divider, Button, Alert, Fade } from '@mui/material';
import { type FormEvent, useEffect, useLayoutEffect, useState } from 'react';
import { MarkdownPreview } from '../components/MarkdownPreview.tsx';
import { useEditArticleMutation, useGetArticleQuery } from '../services/news';
import { useParams } from 'react-router';

const ArticleEditor = ({ content, disabled, setContent }: { content: string; disabled: boolean; setContent: (content: string) => void }) => {
	return (
		<TextField
			disabled={disabled}
			fullWidth
			multiline
			label="Contenu de l'article"
			value={content}
			onChange={e => setContent(e.target.value)}
			placeholder="Écrivez votre article en syntaxe Markdown ici..."
			variant="outlined"
			sx={{
				flex: 1,
				minHeight: 0,
				backgroundColor: 'rgba(10, 10, 10, 0.9)',
				'& .MuiInputBase-root': {
					height: '100%',
					alignItems: 'stretch',
					p: 0,
					borderRadius: 2,
				},
				'& .MuiInputBase-inputMultiline': {
					height: '100% !important',
					overflow: 'auto !important',
					fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
					fontSize: 14,
					lineHeight: 1.6,
					p: 2,
					boxSizing: 'border-box',
				},
			}}
		/>
	);
};

const EditArticle = () => {
	const params = useParams();
	const { data: article, isLoading, isError } = useGetArticleQuery(params.id ? Number(params.id) : 0);

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [editArticle, _props] = useEditArticleMutation();
	const [alert, setAlert] = useState<{
		severity: 'success' | 'info' | 'warning' | 'error';
		message: string | null;
		visible: boolean;
	}>({ severity: 'success', message: null, visible: false });

	useLayoutEffect(() => {
		document.title = "Intranet ESGI | Edition d'article";
	}, []);

	useEffect(() => {
		if (!article) {
			return;
		}

		setTitle(article.title)
		setContent(article.content)
	}, [article])

	const previewText = isLoading ? "# Chargement de l'article..." : isError ? "# Erreur lors du chargement de l'article" : content;

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();

		const result = await editArticle({ id: article?.id ?? 0, title, content });
		if (result.error) {
			let errorString: string = '';
			errorString = ': ';
			if ('status' in result.error) {
				errorString +=
					'error' in result.error
						? (result.error as { error: string }).error
						: (result.error.data as { message: string })?.message;
			} else {
				errorString += result.error.message;
			}

			setAlert({ severity: 'error', message: "Votre article n'a pas pu être modifié :" + errorString, visible: true });
		} else {
			setAlert({
				severity: 'success',
				message: "Votre article a été modifié avec succès. Il devra être validé avant d'être accessible publiquement",
				visible: true,
			});
		}
	};

	return (
		<Container>
			<Paper
				elevation={0}
				sx={{
					my: 4,
					height: '100vh',
					maxHeight: 800,
					display: 'grid',
					gridTemplateRows: '1fr auto 1fr',
					border: '1px solid',
					borderColor: 'divider',
					borderRadius: 3,
					overflow: 'hidden',
					bgcolor: 'rgba(20, 20, 20, 1.0)',
				}}
			>
				<Box
					sx={{
						minHeight: 0,
						overflow: 'auto',
						p: 3,
					}}
				>
					<Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
						Aperçu
					</Typography>

					<MarkdownPreview value={previewText} />
				</Box>

				<Divider />

				<Box
					component="form"
					onSubmit={onSubmit}
					sx={{
						minHeight: 0,
						display: 'flex',
						flexDirection: 'column',
						p: 2,
						gap: 1.5,
						bgcolor: 'rgba(20, 20, 20, 1.0)',
					}}
				>
					<Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
						Éditeur d'article
					</Typography>

					<ArticleEditor disabled={isLoading || isError} content={content} setContent={setContent} />

					<TextField
						disabled={isLoading || isError}
						fullWidth
						label="Titre de l'article"
						sx={{ backgroundColor: 'rgba(10, 10, 10, 0.9)' }}
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
					<Box display="flex" alignItems="center">
						<Fade in={alert.visible} timeout={{ exit: 500, appear: 500, enter: 500 }}>
							<Alert
								severity={alert.severity}
								variant="outlined"
								onClose={() =>
									setAlert(previous => {
										return { severity: previous.severity, message: previous.message, visible: false };
									})
								}
								sx={{ height: 'min-content' }}
							>
								{alert.message}
							</Alert>
						</Fade>
						<Button
							type="submit"
							disabled={!title || !content}
							variant="outlined"
							sx={{ width: 'fit-content', marginLeft: 'auto', justifySelf: 'end', px: 2 }}
						>
							Modifier l'article
						</Button>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export const Component = EditArticle;
