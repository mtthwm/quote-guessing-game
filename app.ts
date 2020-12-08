import express from 'express';
import { join } from 'path';
import config from './utils/config';
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const gameListeners = require('./socketio/gameListeners')(io);
const helpers = require('./utils/helpers');
const codeRouter = require('./controllers/code');
const promptsRouter = require('./controllers/prompts');

app.use(express.static('static'));
app.use('/api/code', codeRouter);
app.use('/api/prompts', promptsRouter);

server.listen(config.PORT, () => {
    console.log(`listening on port: ${config.PORT}`);
})

module.exports = app;