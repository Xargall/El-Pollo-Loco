/**
 * Base class for all collectible objects in the game world.
 * Handles positioning and image loading for items like coins and bottles.
 *
 * @extends DrawableObject
 */
class Collectible extends DrawableObject {

    /**
     * Creates a new Collectible instance at the given position.
     *
     * @param {number} x - Horizontal position in the game world.
     * @param {number} y - Vertical position in the game world.
     * @param {number} width - Width of the collectible in pixels.
     * @param {number} height - Height of the collectible in pixels.
     * @param {string} imagePath - Path to the collectible's image asset.
     */
    constructor(x, y, width, height, imagePath) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.loadImage(imagePath);
    }
}