export type UserRole = 'USER' | 'SALESMAN' | 'ADMIN' | 'SUPER_ADMIN';

export type TUser = {
	id: string;
	userId: string;
	name: string;
	email: string;
	role?: UserRole;
	designation?: string;
};

export interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}


