import { z } from "zod";

export const createUserDto = z
	.object({
		name: z
			.string()
			.min(3, "Name must be at least 3 characters long")
			.max(50, "Name must be at most 50 characters long"),
		email: z.string().email("Invalid email"),
		password: z
			.string()
			.min(4, "Must be at least 4 characters long")
			.max(120, "Must be at most 120 characters long"),
	})
	.strict();

export const loginUserDto = z
	.object({
		email: z.string().email("Invalid email"),
		password: z.string().max(120, "Must be at most 120 characters long"),
	})
	.strict();

export const updateUserDto = z
	.object({
		name: z
			.string()
			.min(3, "Name must be at least 3 characters long")
			.max(50, "Name must be at most 50 characters long"),
		email: z.string().email("Invalid email"),
	})
	.strict();

export type loginUserDtoType = z.infer<typeof loginUserDto>;
export type createUserDtoType = z.infer<typeof createUserDto>;
export type updateUserDtoType = z.infer<typeof updateUserDto>;
