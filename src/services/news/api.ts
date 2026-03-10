import baseApi from '../baseApi';
import type { Article } from './types';
import type { FetchArgs } from '@reduxjs/toolkit/query';

export const newsApi = baseApi.injectEndpoints({
	endpoints: builder => ({
		listArticles: builder.query<Article[], void>({
			query: () => 'news/list',
		}),
		listUserArticles: builder.query<Article[], void>({
			query: () => 'news',
		}),
		getArticle: builder.query<Article, number>({
			query: id => `news/${id}`,
		}),
		deleteArticle: builder.mutation<void, number>({
			query: id => {
				return {
					url: `news/${id}`,
					method: 'DELETE',
				} as FetchArgs;
			},
		}),
		validateArticle: builder.mutation<void, number>({
			query: id => {
				return {
					url: `news/${id}/validate`,
					method: 'PUT',
				} as FetchArgs;
			},
		}),
		requestArticleModifications: builder.mutation<void, { id: number; modifications: string }>({
			query: params => {
				return {
					url: `news/${params.id}/modifications`,
					method: 'PUT',
					body: {
						modifications: params.modifications,
					},
				} as FetchArgs;
			},
		}),
		createArticle: builder.mutation<Article, { title: string; content: string }>({
			query: body => {
				return {
					url: 'news',
					method: 'POST',
					body,
				} as FetchArgs;
			},
		}),
		editArticle: builder.mutation<Article, { id: number; title: string; content: string }>({
			query: params => {
				return {
					url: `news/${params.id}`,
					method: 'PATCH',
					body: {
						title: params.title,
						content: params.content,
					},
				} as FetchArgs;
			},
		}),
	}),
});

export const {
	useListArticlesQuery,
	useListUserArticlesQuery,
	useGetArticleQuery,
	useCreateArticleMutation,
	useEditArticleMutation,
	useValidateArticleMutation,
	useRequestArticleModificationsMutation,
	useDeleteArticleMutation,
} = newsApi;
