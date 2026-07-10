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
 * Resolves an image index from a percentage value using standard 20-point steps.
 * Used by all status bar subclasses.
 *
 * @param {number} percentage - A value between 0 and 100.
 * @returns {number} Index into the status bar IMAGES array (0–5).
 */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}