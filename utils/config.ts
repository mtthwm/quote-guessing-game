require('dotenv').config();

const { PORT, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

export default { PORT, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME };