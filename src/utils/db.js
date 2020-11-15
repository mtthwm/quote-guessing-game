const config = require('./config');
const connection_options = {
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    user: config.DB_USERNAME,
    password: config.DB_PASSWORD,
};
const pg = require('pg');
const pool = new pg.Pool(connection_options);

const get_db_client = () => {
    return new pg.Client(connection_options);
}

const create_game = async (join_code) => {
    return pool.query('INSERT INTO game (join_code) VALUES ($1);', [join_code]);
}

const get_game_by_code = async (join_code) => {
    return (await pool.query('SELECT * FROM game WHERE join_code=$1;', [join_code])).rows[0];
}

const get_players = async (join_code) => {
    return await pool.query('SELECT * FROM player p INNER JOIN game g ON p.game_id = g.id WHERE g.join_code=$1;', [join_code]);
}

const validate_code = async (join_code) => {
    return (await pool.query('SELECT EXISTS(SELECT * FROM game WHERE join_code=$1);', [join_code])).rows[0].exists;
}

const create_user = async (player_name, join_code) => {
    const game_to_join = await get_game_by_code(join_code);
    return pool.query('INSERT INTO player (player_name, game_id) VALUES ($1, $2);', [player_name, game_to_join.id]);
}

const user_exists = async (player_name, join_code) => {
    return (await pool.query('SELECT EXISTS(SELECT * FROM player p INNER JOIN game g ON p.game_id = g.id WHERE join_code = $1 AND player_name = $2);', [join_code, player_name])).rows[0].exists;
}

module.exports = { get_db_client, create_game, validate_code, get_game_by_code, create_user, get_players, user_exists }