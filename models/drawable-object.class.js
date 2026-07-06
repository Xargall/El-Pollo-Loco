/**
 * Base class for all drawable objects in the game world.
 * Provides image loading, caching, and canvas rendering functionality.
 */
class DrawableObject {
    /** @type {number} Horizontal position in the game world. */
    x = 120;
    /** @type {number} Vertical position in the game world. */
    y = 280;
    /** @type {number} Height of the object in pixels. */
    height = 150;
    /** @type {number} Width of the object in pixels. */
    width = 100;
    /** @type {HTMLImageElement} The currently displayed image. */
    img;
    /** @type {Object.<string, HTMLImageElement>} Cache of preloaded images keyed by path. */
    imageCache = [];
    /** @type {number} Index of the current animation frame. */
    currentImage = 0;

    /**
     * Loads a single image and sets it as the current image.
     *
     * @param {string} path - Path to the image asset.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads multiple images into the image cache.
     *
     * @param {string[]} arr - Array of image paths to preload.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the current image onto the canvas at the object's position.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the hitbox outline for debugging purposes.
     * Currently disabled — uncomment the inner blocks to re-enable.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawHitbox(ctx) {
        // if (this instanceof Character || this instanceof Chicken || this instanceof BabyChicken || this instanceof Endboss) {
        //     ctx.beginPath();
        //     ctx.lineWidth = '5';
        //     ctx.strokeStyle = 'blue';
        //     ctx.rect(this.x, this.y, this.width, this.height)
        //     ctx.stroke();
        // }

        // if (this instanceof Character || this instanceof Endboss) {
        //     ctx.beginPath();
        //     ctx.lineWidth = '5';
        //     ctx.strokeStyle = 'red';
        //     ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom)
        //     ctx.stroke();
        // }
    }
}