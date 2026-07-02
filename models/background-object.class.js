/**
 * Represents a background layer object in the game world.
 * Used to build the scrolling parallax background.
 *
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  /** @type {number} Width of the background object, matches canvas width. */
  width = 720;
  /** @type {number} Height of the background object, matches canvas height. */
  height = 480;

  /**
   * Creates a new BackgroundObject instance.
   * Positions it horizontally at the given x coordinate and
   * vertically anchored to the bottom of the canvas.
   *
   * @param {string} imagePath - Path to the background image asset.
   * @param {number} x - Horizontal starting position in the game world.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}