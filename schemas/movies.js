const zod = require('zod')
const movieSchema = zod.object({
    title: zod.string({
        required_error: 'Title is required',
        too_short_error: 'Title should be at least 1 character long',
        too_long_error: 'Title should be no more than 255 characters long',
        invalid_type_error: 'Movie title type must be a string',
    }).min(1).max(255),
    year: zod.number().int().min(1900).max(new Date().getFullYear()),
    director: zod.string().min(1).max(255),
    duration: zod.number().int().positive().min(1).max(300),
    poster: zod.string().url({
        required_error: 'Poster URL is required',
        invalid_type_error: 'Movie poster URL type must be a URL',
        invalid_format_error: 'Movie poster URL should be a valid URL',
    }),
    genre: zod.array(
        zod.enum(['Action', 'Adventure', 'Comedy', 'Crime', 'Sci-Fi',
            'Drama', 'Fantasy', 'Horror', 'Thriller', 'Biography']),
        {
            required_error: 'At least one genre is required',
            invalid_type_error: 'Movie genre type must be an array',
            invalid_enum_error: 'Movie genre must be one of the following: Action, Adventure, Comedy, Crime, Sci-Fi, Drama, Fantasy, Horror, Thriller, Biography',
        }
    ),
    rate: zod.number().int().min(0).max(10).default(5) // .optional() => number | undefined
})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object) // .partial() => todos los parametros son opcionales
}

module.exports = {
    validateMovie,
    validatePartialMovie
}