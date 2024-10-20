import type { NextFunction, Request, Response } from "express";
import { ClientError } from "../exceptions/clientError";
import { NotFoundError } from "../exceptions/notFoundError";
import { User } from "../models/user.model";
import { SignupService } from "../services/authService";
import { CustomError } from "../exceptions/customError";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
import { createUserDto, updateUserDto } from "../dtos/user.dto";
import { ZodError } from "zod";
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class UserController {
	static listAll = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const users = await User.find().select(["_id", "name"]);
			if (!users) throw new NotFoundError("Not user yet!");

			res.status(200).json({
				message: "Users retrieved successfully",
				users,
			});
		} catch (error) {
			if (error instanceof NotFoundError) {
				res.status(error.status).json({
					success: false,
					message: error.message,
				});
			}
			res.status(500).json({
				success: false,
				message: "Internal server error...",
			});
		}
	};

	static getById = async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params.id;
		const user = await User.findById(id).select(["_id", "name", "email"]);

		if (!user) throw new NotFoundError(`User with id ${id} not found`);

		res.status(200).json({
			message: "User retrieved successfully",
			user,
		});
	};

	static newUser = async (req: Request, res: Response, next: NextFunction) => {
		try {
			//const { name, email, password } = req.body;

			const validatedUserData = createUserDto.parse(req.body);

			const [userEmailExistsm, userNameExists] = await Promise.all([
				User.findOne({ email: validatedUserData.email }),
				User.findOne({ name: validatedUserData.name }),
			]);

			if (userNameExists || userEmailExistsm) {
				throw new CustomError("User already exists", 400);
			}

			const user = await SignupService.signup(
				validatedUserData.email,
				validatedUserData.password,
				validatedUserData.name,
			);

			if (!user) throw new ClientError("Error creating user");

			const userObject = user?.toObject() as User;

			const { password: _, ...userParsed } = userObject;
			return res.status(201).json({
				message: "User created successfully",
				user: userParsed,
			});
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					success: false,
					message: error.errors,
				});
			}
			if (error instanceof CustomError || error instanceof ClientError) {
				return res.status(error.status).json({
					success: false,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json({
					success: false,
					message: "Internal server error",
				});
			}
		}
	};

	static editUser = async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params.id;
		//const { name, email } = req.body;

		//if (!name || !email) {
		//throw new ClientError("All fields are required");
		//}
		try {
			const validateUserData = updateUserDto.parse(req.body);

			const user = await User.findById(id).select(["_id", "name", "email"]);
			if (!user) throw new NotFoundError(`User with id ${id} not found`);

			user.name = validateUserData.name;
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					success: false,
					error: error.errors,
				});
			}
			if (error instanceof CustomError) {
				return res.status(error.status).json({
					success: false,
					message: error.message,
				});
			}

			console.error("Errot at :", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	};

	static deleteUser = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		const id = req.params.id;

		const { userId } = req.body;

		try {
			const user = await User.findById(id).select(["_id", "name", "email"]);
			if (!user) {
				throw new NotFoundError(`User with id ${id} not found`);
			}

			if (userId !== user._id.toString()) {
				throw new UnauthorizedError(
					"You are not authorized to delete this user",
				);
			}

			await User.deleteOne({ _id: id });
			res.status(200).json({
				messsage: "User deleted successfully",
			});
		} catch (error) {
			if (
				error instanceof NotFoundError ||
				error instanceof UnauthorizedError
			) {
				res.status(error.status).json({
					success: false,
					message: error.message,
				});
			} else {
				console.error(error);
				res.status(500).json({
					success: false,
					message: "Internal server error",
				});
			}
		}
	};
}

export default UserController;
