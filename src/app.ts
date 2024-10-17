import express from 'express'
import cookieParser from 'cookie-parser'
import routes from './routes/index'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(errorHandler)
app.use('/api/', routes)





export default app