const random_room_code = (length) => {
    const possible_characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let build_string = "";
    for (let i = 0; i < length; i++) {
        build_string += possible_characters.charAt(Math.floor(Math.random() * possible_characters.length));
    }
    return build_string;
}

module.exports = { random_room_code }