import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = { 
    host: 'localhost',
    user: 'root',
    port: 3307,
    password: 'curso_123',  // replace with your actual MySQL password
    database:'moviesdb'
};
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
const connection = await mysql.createConnection(connectionString);

// Modelo para interactuar con la base de datos MySQL
export class MovieModel {
    static async getAll ({ genre }) {
        const [ movies ] = await connection.query(
            'select BIN_TO_UUID(id) as id, title, year, director, duration, poster, rate from movie');
        if(genre) {
            const loweCaseGenres = genre.toLowerCase();
            const [ genres ] = await connection.query(
                `SELECT * FROM genre WHERE LOWER(name) LIKE ?`, [loweCaseGenres]
            )
            if(genres.length === 0) return [];
            const [{ id }] = genres;
            
            const [ movies_genres ] = await connection.query(
                `SELECT * FROM movie_genres INNER JOIN movie WHERE movie_id=?`, [id]
            );
        }
        return movies
        
    }
    static async getById ({ id }) {
        const [ movies ] = await connection.query(
            'select BIN_TO_UUID(id) as id, title, year, director, duration, poster, rate from movie where id = UUID_TO_BIN(?);', [ id ]);
        if (movies.length === 0) return null
        return movies[0]
    }
    static async create ({ input }) {
        const {
            title,
            year,
            director,
            duration,
            poster,
            rate
        } = input;
        const [uuidResult] = await connection.query('SELECT UUID() AS uuid;')
        const [{ uuid }] = uuidResult
        try {
            await connection.query(`insert into movie (id, title, year, director, duration, poster, rate) 
            VALUES (UUID_TO_BIN("${uuid}"),?,?,?,?,?,?);`, [title, year, director, duration, poster, rate])
        } catch (error) {
            console.error(error)
            throw new Error('Error al crear el movie')
        }
        const [movies] = await connection.query(
            `select BIN_TO_UUID(id) as id, title, year, director, duration, poster, rate 
            from movie where id = UUID_TO_BIN(?);`, [uuid]);
        return movies[0]
    }
    static async delete ({ id }) {
        //crear delete
    }
    static async update ({ id, input }) {
        //crear update
    }
}