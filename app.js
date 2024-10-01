const express = require('express')
const crypto = require('node:crypto') // generated ID performance
const cors = require('cors')

const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:5500',
            'http://localhost:1234',
            'http://localhost:5000',
            'http://localhost:5001',
            'http://localhost:8080',
            'http://localhost:8081',
            'http://localhost:8082',
            'http://movies.com'
        ]
        if (ACCEPTED_ORIGINS.includes(origin) ||!origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))
app.disable('x-powered-by')
// Metodos simples: GET/HEAD/POST
// Metodos complejos: PUT/PATH/DELETE

// CORS PRE-Flight
// OPTIONS

// Tod0 los recursos que sean MOVIES se identifica con /movies
app.get('/movies', (req, res) => {
    /* const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin); // para dar acceso al encabezado del servidor
    } */
    const { genre } = req.query
    if (genre) {
        const filteredMovies = movies.filter(
            m => m.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) => { // path-to-regexp mapping
    const { id } = req.params
    const movie = movies.find(m => m.id === id)
    if (!movie) {
        return res.status(404).json({ error: 'Movie not found' })
    }
    res.json(movie)
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    // en base de datos
    const newMovie = {
        id: crypto.randomUUID(), // UUID v4
        ...result.data
    }
    // Esto no sería REST, porque estamos guardando
    // el estado de la aplicación en memoria
    movies.push(newMovie)

    res.status(201).json(newMovie) // actualizar la cache del cliente
})

app.delete('/movies/:id', (req, res) => {
    /*const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin); // para dar acceso al encabezado del servidor
    }*/

    const { id } = req.params
    const movieIndex = movies.findIndex(m => m.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie not found' })
    }

    movies.splice(movieIndex, 1)
    return res.json({ message: "Movie deleted" }) // 204 No Content
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const movieIndex = movies.findIndex(m => m.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie not found' })
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    movies[movieIndex] = updateMovie
    return res.status(200).json(updateMovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}/movies`)
})