import express from 'express';
import { join } from 'path';
import config from './utils/config';
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const helpers = require('./utils/helpers');
const db = require('./utils/db');
const codeRouter = require('./controllers/code');
const promptsRouter = require('./controllers/prompts');

io.on('connect', (socket: any) => {
    socket.on('join_room', async (data: any) => {
        const {join_code, player_name} = data;
        socket.join(join_code);
        if (!await db.user_exists(player_name, join_code)) {
            const existing_players = await db.get_players(join_code);
            await db.create_user(player_name, join_code, existing_players.length);
        }
        const players = await db.get_players(join_code);
        io.sockets.in(join_code).emit('player_join', players);
    });
    socket.on('message', (data: any) => {
        console.log(data);
    });
    socket.on('disconnect', async () => {
        console.log(socket.id);
        const join_code = await db.get_game_code_by_player_socket(socket.io);
        await db.delete_user_by_socket(socket.id);
        const players = await db.get_players(join_code);
        io.sockets.in(join_code).emit('player_join', players);
    });
});

io.on('disconnect', (socket: any) => {
    console.log('disconnected');
});

app.use(express.static('static'));
app.use('/api/code', codeRouter);
app.use('/api/prompts', promptsRouter);

server.listen(config.PORT, () => {
    console.log(`listening on port: ${config.PORT}`);
})

module.exports = app;