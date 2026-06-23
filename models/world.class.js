class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas for the next frame
    this.ctx.drawImage(
      this.character.img,
      this.character.x,
      this.character.y,
      this.character.width,
      this.character.height,
    );
    // Draw all enemies on the canvas
    this.enemies.forEach((enemy) => {
      this.ctx.drawImage(
        enemy.img,
        enemy.x,
        enemy.y,
        enemy.width,
        enemy.height,
      );
    });
    requestAnimationFrame(() => this.draw()); // Call draw for the next frame, defined by Graphics Card
  }
}
