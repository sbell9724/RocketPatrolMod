class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }

    preload() {
      // load images/tile sprites
      this.load.image('ball', './assets/basketball.png');
      this.load.image('hoop', './assets/hoop.png');
      this.load.image('spaceship', './assets/target.png');
      this.load.image('starfield', './assets/court.png');

      // load spritesheet
      this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    
    create() {
      // place tile sprite
      this.court = this.add.tileSprite(0, 0, 640, 480, 'court').setOrigin(0, 0);

      // add rocket (p1)
      this.p1Ball = new Ball(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'ball').setOrigin(0.5, 0);

      // add spaceships (x3)
      this.hoop01 = new Hoop(this, game.config.width + borderUISize*6, borderUISize*4, 'hoop', 0, 30).setOrigin(0, 0);
      this.hoop02 = new Hoop(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'hoop', 0, 20).setOrigin(0,0);
      this.hoop03 = new Hoop(this, game.config.width, borderUISize*6 + borderPadding*4, 'hoop', 0, 10).setOrigin(0,0);

      // green UI background
      this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
      // white borders
      this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
      this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
      this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
      this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

      // define keys
      keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
      keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

      // animation config
      this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
      frameRate: 30
    });
      // initialize score
      this.p1Score = 0;

      // display score
      let scoreConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#F3B141',
      color: '#843605',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 100
      }
      this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

      // GAME OVER flag
      this.gameOver = false;

      // 60-second play clock
      scoreConfig.fixedWidth = 0;
      this.clock = this.time.delayedCall(60000, () => {
          this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
          this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
          this.gameOver = true;
      }, null, this);
    }

    update() {
      // check key input for restart
      if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
          this.scene.restart();
      }

      if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
        this.scene.start("menuScene");
      }
      
      // background moving
      this.court.tilePositionX -= 4;
      if (!this.gameOver) {               
        this.p1Ball.update();       // update rocket sprite
        this.hoop01.update();         // update spaceships (x3)
        this.hoop02.update();
        this.hoop03.update();
      } 

      // check collisions
      if(this.checkCollision(this.p1Ball, this.hoop03)) {
        this.p1Ball.reset();
        this.shipExplode(this.hoop03);
      }
      if (this.checkCollision(this.p1Ball, this.hoop02)) {
        this.p1Ball.reset();
        this.shipExplode(this.hoop02);
      }
      if (this.checkCollision(this.p1Ball, this.hoop01)) {
        this.p1Ball.reset();
        this.shipExplode(this.hoop01);
      }
      
    }


    //These are remnants of the base code; however, they still work because the variables are localized, so I am not going to touch them
    checkCollision(rocket, ship) {
      if (rocket.x < ship.x + ship.width && 
        rocket.x + rocket.width > ship.x && 
        rocket.y < ship.y + ship.height &&
        rocket.height + rocket.y > ship. y) {
            return true;
      } else {
        return false; 
      }
    }

    shipExplode(ship) {
      // temporarily hide ship
      ship.alpha = 0;
      // create explosion sprite at ship's position
      let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
      boom.anims.play('explode');             // play explode animation
      boom.on('animationcomplete', () => {    // callback after anim completes
        ship.reset();                         // reset ship position
        ship.alpha = 1;                       // make ship visible again
        boom.destroy();                       // remove explosion sprite
      });
      // score add and repaint
      this.p1Score += ship.points;
      this.scoreLeft.text = this.p1Score;
      this.sound.play('sfx_explosion');
    }
  }