import config from './config';
import {Player} from '../types/Types';
import { join } from 'path';
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

const create_game = async (join_code : string) => {
    return pool.query('INSERT INTO game (join_code) VALUES ($1);', [join_code]);
}

const get_game_by_code = async (join_code : string) => {
    return (await pool.query('SELECT * FROM game WHERE join_code=$1 LIMIT 1;', [join_code])).rows[0];
}

const get_players = async (join_code : string): Promise<Player[]> => {
    const game = await get_game_by_code(join_code);
    return (await pool.query('SELECT * FROM player WHERE game_id=$1;', [game.id])).rows;
}

const validate_code = async (join_code : string) => {
    return (await pool.query('SELECT EXISTS(SELECT * FROM game WHERE join_code=$1);', [join_code])).rows[0].exists;
}

const create_user = async (player_name : string, join_code : string, player_index: number) => {
    const game_to_join = await get_game_by_code(join_code);
    console.log(game_to_join, "JOIN GAME");
    return pool.query('INSERT INTO player (player_name, game_id, player_index) VALUES ($1, $2, $3);', [player_name, game_to_join.id, player_index]);
}

const user_exists = async (player_name : string, join_code : string) => {
    return (await pool.query('SELECT EXISTS(SELECT * FROM player p INNER JOIN game g ON p.game_id = g.id WHERE join_code = $1 AND player_name = $2);', [join_code, player_name])).rows[0].exists;
}

const reindex_users = async (game_id: string) => {
    return (await pool.query('WITH rec AS (SELECT 0 i UNION ALL SELECT i+1 FROM rec WHERE i < COUNT(SELECT * FROM player WHERE game_id=$1)) SELECT * FROM rec', [game_id]))
}

const get_player_by_socket = async (socket_id: string) => {
    return (await pool.query('SELECT * FROM player WHERE player_socket=$1 LIMIT 1;', [socket_id])).rows[0];
}

const get_game_code_by_player_socket = async (socket_id: string) => {
    return (await pool.query('SELECT * FROM player p INNER JOIN game g ON p.game_id = g.id WHERE player_socket=$1 LIMIT 1', [socket_id])).rows[0].join_code;
}

const delete_user_by_socket = async (socket_id: string): Promise<void> => {
    await pool.query('DELETE FROM player WHERE player_socket=$1;', [socket_id]);
    await reindex_users(await get_game_code_by_player_socket(socket_id));
}

module.exports = { get_db_client, create_game, validate_code, get_game_by_code, create_user, get_players, user_exists, delete_user_by_socket, reindex_users, get_game_code_by_player_socket, get_player_by_socket }