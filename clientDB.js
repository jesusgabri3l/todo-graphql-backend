const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

const client = new Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432
})

client.connect((error) => {
	if(error) return 0
	console.log('Connected!')
})

module.exports = client