// como leer un json en ESModules recomendado por ahora
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export const readJSON = (path) => require(path)

// ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
// import movies from './movies.json' with { type: 'json' } ==> proposal-import-attributes 

// como leer un json en ESModules
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

