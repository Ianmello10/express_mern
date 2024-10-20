import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Response, Request, NextFunction } from "express";
import { CustomError } from "../exceptions/customError";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const headerAuth = <string>req.header("Authorization");

	if (!headerAuth) {
		res.status(401).json({
			success: false,
			message: "Missing or invalid token unauthorized !",
		});
		return;
	}

	const [bearer, token] = headerAuth.split(" ");
	if (bearer !== "Bearer" || !token) {
		res.status(401).json({
			success: false,
			message: "Missing or invalid token unauthorized !",
		});
		return;
	}

	try {
		const JwtPayload = jwt.verify(token, process.env.PRIVATE_KEY as string, {
			algorithms: ["HS256"],
			audience: "http://localhost:3000",
			issuer: "http://localhost:3000",
			clockTolerance: 5,
			ignoreExpiration: false,
			ignoreNotBefore: false,
		}) as JwtPayload;

		req.body.userId = JwtPayload.userId;

		next();
	} catch (error) {
		if (
			error instanceof jwt.JsonWebTokenError ||
			error instanceof jwt.TokenExpiredError
		) {
			res
				.status(401)
				.json({ success: false, message: "Invalid token or expired" });
			return;
		}
		console.error("Erro na verificação do token:", error);
		res
			.status(500)
			.json({ success: false, message: "Internal server error jwt !!" });
		return;
	}
};
