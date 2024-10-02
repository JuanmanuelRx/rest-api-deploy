import cors from 'cors'
// valors defaults
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

// Middleware para habilitar CORS
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
        if (acceptedOrigins.includes(origin) ||!origin) {
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
})