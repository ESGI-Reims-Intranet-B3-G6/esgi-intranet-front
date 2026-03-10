import { Box, Typography, Container, Paper, Button, Card, Link } from '@mui/material';
import { Link as ReactRouterLink } from 'react-router-dom';
import { FullscreenLoader } from '../components/FullscreenLoader.tsx';
import { type Article, useListArticlesQuery } from '../services/news';
import { format } from 'date-fns';
import { MarkdownPreview } from '../components/MarkdownPreview.tsx';
import { Routes } from '../router';
import { useNavigate } from 'react-router';

const ArticleShortPreview = ({ article }: { article: Article }) => {
	return (
		<Card sx={{ p: 2 }}>
			<Link component={ReactRouterLink} to={Routes.NewsArticle(`${article.id}`)} color="inherit" underline="none">
				<Typography variant="h5">{article.title}</Typography>
				<MarkdownPreview value={article.content} summary={true} />
				<Typography variant="body2" color="lightgray">
					{article.user ? `${article.user.firstName} ${article.user.lastName}` : 'Utilisateur inconnu'}
				</Typography>
				<Typography variant="body2" color="darkgray">{format(article.publishedAt || article.lastRevision, 'dd/MM/yy HH:mm')}</Typography>
			</Link>
		</Card>
	);
};

const ArticleShortPreviewList = (props: { articles: Article[] }) => {
	const navigator = useNavigate();
	const containsUnpublishedArticles = props.articles.some(article => !article.publishedAt);
	return (
		<>
			{containsUnpublishedArticles && (
				<Box>
					<Box display="flex" alignItems="center">
						<Typography variant="h4">Articles en cours de validation :</Typography>
						<Button sx={{ px: 2, marginLeft: 'auto' }} variant="outlined" onClick={() => navigator(Routes.CreateArticle)}>
							Créer un article
						</Button>
					</Box>
					<Paper
						elevation={0}
						sx={{
							my: 4,
							border: '1px solid',
							borderColor: 'divider',
							borderRadius: 3,
							overflow: 'hidden',
							bgcolor: 'rgba(20, 20, 20, 1.0)',
						}}
					>
						<Box m={2} display="flex" flexDirection={'column'} gap={4}>
							{props.articles
								.filter(article => !article.publishedAt)
								.map(article => (
									<ArticleShortPreview article={article} />
								))}
						</Box>
					</Paper>
				</Box>
			)}
			<Box>
				<Box display="flex" alignItems="center">
					<Typography variant="h4">Liste des articles publiés :</Typography>
					{!containsUnpublishedArticles &&
						<Button sx={{ px: 2, marginLeft: 'auto' }} variant="outlined" onClick={() => navigator(Routes.CreateArticle)}>
							Créer un article
						</Button>
					}
				</Box>
				<Paper
					elevation={0}
					sx={{
						my: 4,
						border: '1px solid',
						borderColor: 'divider',
						borderRadius: 3,
						overflow: 'hidden',
						bgcolor: 'rgba(20, 20, 20, 1.0)',
					}}
				>
					<Box m={2} display="flex" flexDirection={'column'} gap={4}>
						{props.articles
							.filter(article => !!article.publishedAt)
							.map(article => (
								<ArticleShortPreview article={article} />
							))}
					</Box>
				</Paper>
			</Box>
		</>
	);
};

const News = () => {
	const { data: articles, isLoading, isError } = useListArticlesQuery();

	return (
		<Container>
			<FullscreenLoader loading={isLoading} />
			<Box mt={2}>
				{isError && <Typography variant="h1">Erreur lors de la récupération des articles</Typography>}
				{!isLoading && articles && <ArticleShortPreviewList articles={articles} /> }
			</Box>
		</Container>
	);
};

export const Component = News;
