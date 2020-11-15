const config = require('./config');
const connection_options = {
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    user: config.DB_USERNAME,
    password: config.DB_PASSWORD,
};
const pg = require('pg');
const fs = require('fs');

const sql = fs.readFileSync(__dirname+'\\schema.sql').toString();
const client = new pg.Client(connection_options);

client.connect()
    .then(() => {
        client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;")
            .then(() => {
                client.query(sql)
                .then(() => {
                    client.end();
                    process.exit(1);
                })
                .catch((err) => {
                    console.log(err);
                    process.exit(-1);
                });
            })
            .catch(() => {
                console.log(err);
                process.exit(-1);
            });
    })
    .catch((err) => {
        console.log(err);
        process.exit(-1);
    });