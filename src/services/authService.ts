import * as argon2 from "argon2";
import { User } from "../models/user.model";
import crypto from "node:crypto";
import { ClientError } from "../exceptions/clientError";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
import { CustomError } from "../exceptions/customError";
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class SignupService {
	static signup = async (email: string, password: string, name: string) => {
		const hashedPassword = await argon2.hash(password, {
			type: argon2.argon2id,

			memoryCost: 1024,

			timeCost: 6,
		});

		const verificationToken = crypto.randomUUID();
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let user;

		try {
			user = new User({
				email,
				password: hashedPassword,
				name,
				verificationToken,
				verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
			});

			await user.save();
		} catch (e) {
			console.error(e);
			throw new CustomError("Server error, please try again !!");
		}
		return user;
	};
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class LoginService {
	static login = async (email: string, password: string) => {
		const user = await User.findOne({ email: email });

		if (!user) {
			throw new UnauthorizedError("Invalid credentials");
		}

		const passwordValid = await argon2.verify(user.password, password);

		if (!passwordValid) {
			throw new UnauthorizedError("Invalid credentials");
		}

		return user;
	};
}
