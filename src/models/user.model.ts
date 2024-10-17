import mongoose from "mongoose";


export interface User extends Document {

    email: string
    name: string
    password: string
    lastLogin: Date
    isVeriefied: boolean
    resetPasswordToken: string
    resetPasswordExpiresAt: Date
    verificationToken: string
    verificationExpiresAt: Date
}



const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: async function (v: string): Promise<boolean> {
                const doc = await User.findOne({ name: v })
                //compare the current id with the id in the database
                if (doc) return this._id.toString() === doc._id.toString()
                return Boolean(!doc)
            },
            message: 'Name already exists'
        }


    },
    password: {
        type: String,
        required: true,
        minLength: [4, 'Password must be at least 4 characters long'],
        maxLength: [120, 'Password must be at most 120 characters long']

    },

    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVeriefied: {
        type: Boolean,
        default: false
    },

    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationExpiresAt: Date,
}, { timestamps: true })

export const User = mongoose.model<User>('User', userSchema)
