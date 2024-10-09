import mongoose from "mongoose";


export const connectDB = async () => {

try {
    await mongoose.connect(process.env.MONGOURI as string)

    
} catch (error) {
    
    console.log('Error connection to mongo',error)
    process.exit(1)
}

}