import type { Response, Request } from "express";
import { LoginService, SignupService } from "../services/authService";
import { generateAccessToken } from "../utils/generateAccessToken";
import type { User } from "../models/user.model";
import { CustomError } from "../exceptions/customError";
import { generateRefreshToken } from "../utils/genereateRefreshToken";
import { loginUserDto, type loginUserDtoType } from "../dtos/user.dto";
import { ZodError } from "zod";
import { UnauthorizedError } from "../exceptions/unauthorizedError";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class AuthController {
	static login = async (req: Request, res: Response) => {
		try {
			const validatedUserLogin = loginUserDto.parse(req.body);

			const user = await LoginService.login(
				validatedUserLogin.email,
				validatedUserLogin.password,
			);
			const userObject = user?.toObject() as User;
			const { password: _, ...userParsed } = userObject;

			user.lastLogin = new Date();
			await user.save();
			const { refreshToken } = generateRefreshToken(res, user._id.toString());
			const { accessToken } = generateAccessToken(res, user._id.toString());

			if (!accessToken || !refreshToken) {
				throw new CustomError("Failed to generate token", 500);
			}
			res
				.status(200)
				.cookie("token", refreshToken, {
					maxAge: 7 * 24 * 60 * 60 * 1000,
					httpOnly: true,
					sameSite: "strict",
					secure: process.env.NODE_ENV === "production",
				})
				.json({
					success: true,
					message: "User logged in successfully",
					user: userParsed,
				});
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					success: false,
					message: error.errors,
				});
			}
			if (error instanceof UnauthorizedError) {
				return res.status(error.status).json({
					success: false,
					message: error.message,
				});
			}

			if (error instanceof CustomError) {
				return res.status(error.status).json({
					success: false,
					message: error.message,
				});
			}
			//console.error("Error at :", error);
			return res.status(500).json({
				success: false,
				message: "Server error, please try again !&",
			});
		}
	};

	static logout = async (req: Request, res: Response) => {
		res.clearCookie("token");
		res.header("Authorization", "");
		res
			.status(200)
			.json({ success: true, message: "User logged out successfully" });
	};

	static refreshToken = async (req: Request, res: Response) => {
		try {
			const accessToken = generateAccessToken(res, req.body.userId);

			if (!accessToken) throw new CustomError("Refresh token is required", 400);

			res.json({
				success: true,
				message: "Token refreshed successfully",
			});
		} catch (error) {
			if (error instanceof CustomError) {
				return res.status(error.status).json({
					success: false,
					message: error.message,
				});
			}
			res.status(500).json({
				success: false,
				message: "Server error, please try again",
			});
		}
	};

	/*
    export const profileController = async (req: Request, res: Response) => {
    
        const userId = req.body.userId
        console.log(userId)
    
        const user = await User.findById(userId).select('-password')
    
        if (!user) {
    
            res.status(400).json({
                success: false,
                message: 'User ID is required'
            })
        }
    
        res.status(200).json({ success: true, user })
    }
    */
}

export default AuthController;
