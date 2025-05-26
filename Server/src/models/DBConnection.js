import { createPool } from 'mysql2/promise'
import {config} from 'dotenv'

config()

const ENV = process.env

export const pool = createPool({
    host:ENV.HOST,
    user:ENV.USER,
    database:ENV.DATABASE,
    password:ENV.PASSWORD,
    port: ENV.PORT
})