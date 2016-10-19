"use strict";

const Player = require("./ui.js").Player;

new Player({
    client_id: 5655803,
    loginWindow: {
        width: 250,
        height: 200,
    },
    playlistWindow: {
        width: 500,
        height: 900,
    }
});