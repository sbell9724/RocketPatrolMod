class Hoop extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);                                // add object to existing scene
      this.points = pointValue;                                // store pointValue
      this.moveSpeed = game.settings.spaceshipSpeed;           // pixels per frame
    }

    update() {
        // move hoop left
        this.x -= this.moveSpeed;
        // wraparound
        if(this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width;
    }
}