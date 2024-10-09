import * as argon2 from "argon2";
import { User } from "../models/user.model";
import crypto from "node:crypto";
export class SignupService {

    public async signup(email: string, password: string, name: string) {

        const hashedPassword = await argon2.hash(password, {

            type: argon2.argon2id,

            memoryCost: 1024,

            timeCost: 6,

        })


        const verificationToken = crypto.randomUUID()


        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000,

        })

        await user.save()

        return user

    }
}

export class LoginService {


    public async login(email: string, password: string) {

        const user = await User.findOne({ email: email })

        if (!user) {

            throw new Error('User not found')
        }

        const passwordValid = await argon2.verify(user.password, password)
        console.log(passwordValid)

        if (!passwordValid) {

            throw new Error('Invalid credentials')
        }


        return user

    }

}