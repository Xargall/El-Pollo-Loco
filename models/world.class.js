class World {
  character = new Character();

  level = level1;

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
    this.addObjectsToMap(this.level.backgroundObjects);

    // Draw the character on the canvas
    this.addToMap(this.character);

    // Draw all enemies on the canvas
    this.addObjectsToMap(this.level.enemies);

    // Draw all clouds on the canvas
    this.addObjectsToMap(this.level.clouds);

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
      this.flipImage(mo);

    }
    mo.draw(this.ctx)
    mo.drawHitbox(this.ctx)

    if (mo.otherDirection) {
      this.flipReverse(mo)
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipReverse(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
