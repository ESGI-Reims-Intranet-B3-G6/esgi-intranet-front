export const RolesList = ['GUEST', 'ETUDIANT', 'INTERVENANT', 'ADMIN', 'SUPERADMIN'] as const;
export type Role = (typeof RolesList)[number];

export type UserInfo = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	lastLogin: Date;
	userRole: Role;
};
