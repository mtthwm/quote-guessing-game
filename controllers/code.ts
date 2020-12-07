import express from 'express';
const codeRouter = express.Router();
const helpers = require('../utils/helpers');
const db = require('../utils/db');

codeRouter.post('/', async (request, response) => {
    const join_code = helpers.random_room_code(6);
    try {
        await db.create_game(join_code);
        response.json({'join_code': join_code});
    } catch (err) {
        console.log(err);
        response.status(500).end();
    }
});

codeRouter.get('/validate/:join_code', async (request, response) => {
    const join_code = request.params.join_code;
    try {
        const valid = await db.validate_code(join_code);
        response.send({'valid': valid})
    } catch (e)
    {
        console.log(e);
    }
});

module.exports = codeRouter;