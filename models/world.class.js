class World {
  character = new Character();

  enemies = level1.enemies;
  clouds = level1.clouds;
  backgroundObjects = level1.backgroundObjects;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    // Clear the canvas for the next frame
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    // Draw all background objects on the canvas
    this.addObjectsToMap(this.backgroundObjects);

    // Draw the character on the canvas
    this.addToMap(this.character);

    // Draw all enemies on the canvas
    this.addObjectsToMap(this.enemies);

    // Draw all clouds on the canvas
    this.addObjectsToMap(this.clouds);

    // Call draw for the next frame, defined by Graphics Card
    requestAnimationFrame(() => this.draw());

    this.ctx.translate(-this.camera_x, 0);
  }

  // Add multiple movable objects to the canvas
  addObjectsToMap(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  // Add a movable object to the canvas
  addToMap(mo) {
    if (mo.otherDirection) {
      this.ctx.save();
      this.ctx.translate(mo.width, 0);
      this.ctx.scale(-1, 1);
      mo.x = mo.x * -1;

    }
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);

    if (mo.otherDirection) {
      mo.x = mo.x * -1;
      this.ctx.restore();
    }
  }
}
