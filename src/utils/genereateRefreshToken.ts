import jwt from "jsonwebtoken";
import type { Response, Request } from "express";
import { CustomError } from "../exceptions/customError";

export const generateRefreshToken = (
	res: Response,
	userId: string,
): { refreshToken?: string } => {
	const privateKey = process.env.PRIVATE_KEY as string;

	if (!privateKey)
		throw new CustomError("A internal server error occurred", 500);

	let refreshToken: string | undefined;

	try {
		refreshToken = jwt.sign({ userId }, privateKey as string, {
			algorithm: "HS256",
			expiresIn: "7d",
			notBefore: "0",
			audience: "http://localhost:3000",
			issuer: "http://localhost:3000",
		});
	} catch (err) {
		if (err instanceof jwt.JsonWebTokenError) {
			res.status(401).json({
				success: false,
				message: "Failed to generate Token ",
			});
			return {
				refreshToken: undefined,
			};
		}
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
		return {
			refreshToken: undefined,
		};
	}

	return { refreshToken };
};
