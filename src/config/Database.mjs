import mysql from 'mysql2/promise';
import dotenv from "dotenv"

//Load the environment variables
dotenv.config({ path: "./src/config/configs.env" });

//Connect database
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default db;
