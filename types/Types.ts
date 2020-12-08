export interface Player {
    game_id: number,
    id: number,
    player_name: string,
    connected: boolean,
    player_index: number
}

export interface Game {
    id: number,
    game_started: boolean,
    join_code: string,
    create_time: Date,
    start_time: Date
}