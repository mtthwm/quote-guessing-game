const express = require('express');
const promptsRouter = express.Router();
const axios = require('axios');

promptsRouter.post('/', (request, response) => {
    const amount = request.params.amount;
    for (let i = 0; i < amount; i++) {

    }
});

promptsRouter.get('/get_categories', async (request, response) => {
    const tags = await axios.get('api.tronalddump.io/tag');
    console.log(tags);

});

module.exports = promptsRouter;