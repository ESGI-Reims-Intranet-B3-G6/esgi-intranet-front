export const RolesList = ['ETUDIANT', 'INTERVENANT', 'ADMIN', 'SUPERADMIN'] as const;
export type Role = (typeof RolesList)[number];

export type LoginCallbackRequest = {
	code: string;
	sessionState: string;
};

export type UserInfo = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	lastLogin: Date;
	userRole: Role;
};
