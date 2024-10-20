import jwt from "jsonwebtoken";
import type { Response } from "express";
import { CustomError } from "../exceptions/customError";

//Generate token and set cookie
export const generateAccessToken = (
	res: Response,
	userId: string,
): { accessToken?: string } => {
	const privateKey = process.env.PRIVATE_KEY as string;

	//if (!privateKey) throw new CustomError('A internal server error occurred', 500)

	let accessToken: string | undefined;

	try {
		accessToken = jwt.sign({ userId }, privateKey as string, {
			//symmetric encryption
			algorithm: "HS256",
			expiresIn: "1m",
			notBefore: "0",
			audience: "http://localhost:3000",
			issuer: "http://localhost:3000",
		});

		res.setHeader("Authorization", `Bearer ${accessToken}`);
	} catch (err) {
		if (err instanceof jwt.JsonWebTokenError) {
			res.status(401).json({
				message: "Failed to generate token",
				success: false,
			});
			return {
				accessToken: undefined,
			};
		}
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
		return {
			accessToken: undefined,
		};
	}

	return { accessToken };
};
