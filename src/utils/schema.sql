CREATE TABLE game (
    id BIGSERIAL PRIMARY KEY,
    join_code VARCHAR(6) NOT NULL UNIQUE,
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    start_time TIMESTAMP
);

CREATE TABLE player (
    id BIGSERIAL PRIMARY KEY,
    player_name VARCHAR(10) NOT NULL,
    game_id INTEGER NOT NULL,
    constraint fk_player_game
        FOREIGN KEY (game_id)
        REFERENCES game (id)
);