// Solomon Bell, Rocket Patrol Mod, 4/19/2022, ~5 Hours
// 60 points for full aesthetic overhaul
// 5 points for high score tracking
// 5 points for 'Fire' UI text
// 5 points for copyright free soundtrack (The song 'Badass' at the link https://www.bensound.com/royalty-free-music/funky-groove)
// 5 points for allowing the player to control the ball after shot
// 20 points for creating a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points


let config = {
    width: 640,
    height: 480,
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;

let hiScore = 0
