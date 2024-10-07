import mysql from 'mysql2/promise'

const config = { 
    host: 'localhost',
    user: 'root',
    password: 'curso_123',  // replace with your actual MySQL password
    database:'moviesdb'
};
const connection = await mysql.createConnection(config);

// Modelo para interactuar con la base de datos MySQL
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL server.');
})

connection.end();
export class MovieModel {
    static async getAll ({ genre }) {
        const result = await connection.query('select * from movies');
        console.log(result);
    }
    static async getById ({ id }) {
        // ...
    }
    static async create ({ input }) {
        // ...
    }
    static async delete ({ id }) {
        // ...
    }
    static async update ({ id, input }) {
        // ...
    }
}