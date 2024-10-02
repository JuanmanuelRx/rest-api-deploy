import express, { json } from 'express'
// generated ID performance
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'

const app = express()

app.use(json())
app.use(corsMiddleware({
    acceptedOrigins: ['http://localhost:8083', 'https://localhost:8084']
}))
app.disable('x-powered-by')

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}/movies`)
})