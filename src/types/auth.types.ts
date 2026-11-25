export type UserRole = 'USER' | 'SALESMAN' | 'ADMIN' | 'SUPER_ADMIN';

// The signed-in customer. Right after sign-in only the basics are known (they come from the
// sign-in pass); the rest arrives with the profile.
export type TUser = {
	id: string;
	userId: string;
	name: string;
	email: string;
	role?: UserRole;
	designation?: string;
	phone?: string | null;
	/** Older accounts kept the phone number under this name. */
	contact?: string | null;
	address?: string | null;
	district?: string | null;
	imageUrl?: string | null;
};
