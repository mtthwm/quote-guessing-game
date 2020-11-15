const express = require('express');
const { join } = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const helpers = require('./utils/helpers');
const config = require('./utils/config');
const db = require('./utils/db');
const codeRouter = require('./controllers/code');
const promptsRouter = require('./controllers/prompts');

io.on('connect', socket => {
    socket.on('join_room', async (data) => {
        const {join_code, player_name} = data;
        socket.join(join_code);
        if (!await db.user_exists(player_name, join_code)) {
            await db.create_user(player_name, join_code);
        }
        const players = await db.get_players(join_code);
        console.log(players.rows);
        socket.to(join_code).emit('player_join', players.rows);
    });
    socket.on('message', (data)=>{
        console.log(data);
    });
});

io.on('disconnect', socket => {
    console.log('disconnected');
});

app.use(express.static('static'));
app.use('/api/code', codeRouter);
app.use('/api/prompts', promptsRouter);

server.listen(config.PORT, () => {
    console.log(`listening on port: ${config.PORT}`);
})

module.exports = app;