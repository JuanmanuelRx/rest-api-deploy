import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import { MovieModel } from "../models/movies.js";
export class MovieController {
    static async getAll(req, res) {
        const { genre } = req.query;
        const movies = await MovieModel.getAll({ genre });
        res.json(movies);
    }
    //...
    static async getById(req, res) {
        const { id } = req.params;
        const movie = await MovieModel.getById({ id });
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    }
    //...
    static async create(req, res) {
        const result = validateMovie(req.body)
        if (!result.success) {
            return res.status(422).json({ error: JSON.parse(result.error.message) })
        }
        const newMovie = await MovieModel.create({ input: result.data })
        res.status(201).json(newMovie)
    }
    //...
    static async delete(req, res) {
        const { id } = req.params
        const result = await MovieModel.delete({ id })
        if (result) {
            return res.json({ message: "Movie deleted" }) // 204 No Content
        } else {
            return res.status(404).json({ error: 'Movie not found' })
        }
    }
    //...
    static async update(req, res) {
        const result = validatePartialMovie(req.body)
        if (!result.success) {
            return res.status(422).json({ error: JSON.parse(result.error.message) })
        }
        const { id } = req.params
        const updateMovie = await MovieModel.update({ id, input: result.data })
        if (updateMovie) {
            return res.status(200).json(updateMovie)
        } else {
            return res.status(404).json({ error: 'Movie not found' })
        }
    }
    //...
}