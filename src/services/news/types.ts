import type { UserInfoRestricted } from '../users';

export type Article = {
	id: number;
	publishedAt?: Date;
	lastRevision: Date;
	modificationsRequested?: string;
	title: string;
	content: string;
	user?: UserInfoRestricted;
};
