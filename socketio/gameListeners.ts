import {Player, Game} from '../types/Types';
const db = require('../utils/db');

exports = module.exports = function gameListeners (io: any) {
    io.sockets.on('connect', (socket: any) => {
        console.log("CONNECT ", socket.id);
        socket.on('join_room', async (data: any) => {
            const {join_code, player_name} = data;
            socket.join(join_code);
            if (!await db.user_exists(player_name, join_code)) {
                const existing_players: Player[] = await db.get_players(join_code);
                await db.create_user(player_name, join_code, existing_players.length, socket.id);
            }
            const players = await db.get_players(join_code);
            io.sockets.in(join_code).emit('player_join', players);
        });
        socket.on('message', (data: any) => {
            console.log(data);
        });
        socket.on('disconnect', async () => {
            console.log("DISCONNECT", socket.id);
            const game = await db.get_game_by_player_socket(socket.id);
            const join_code = game.join_code;
            await db.delete_user_by_socket(socket.id);
            const players = await db.get_players(join_code);
            io.sockets.in(join_code).emit('player_join', players);
        });
        socket.on('reconnect', async () => {
            console.log("RECONNECT", socket.id);
        });
    });
    
    io.on('disconnect', (socket: any) => {
        console.log('disconnected');
    });
}