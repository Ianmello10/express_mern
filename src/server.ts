import app from "./app";
import mongoose from "mongoose";
import { connectDB } from "./db/mongo";

const port = process.env.PORT || 3030
app.set('port', port)

const server = app.listen(app.get('port'), () => {

    connectDB()

    try {

        const adress = server.address()

        console.log(`Express server listening on port ${typeof adress === 'string' ? adress : adress?.port}`)
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (_err: any) {

        throw new Error(_err)

    }
})


//g0IeQkCxyBWMR1V4

//mongodb+srv://lucasianazul:g0IeQkCxyBWMR1V4@cluster0.xx7zt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0