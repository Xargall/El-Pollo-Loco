/**
 * Represents a decorative cloud in the game world.
 * Moves continuously to the left across the screen.
 *
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    /** @type {number} Fixed vertical position of the cloud. */
    y = 20;
    /** @type {number} Width of the cloud in pixels. */
    width = 500;
    /** @type {number} Height of the cloud in pixels. */
    height = 250;
    /** @type {number} Interval ID for the movement loop. */
    intervalId;

    /**
     * Creates a new Cloud instance.
     * Sets a random horizontal starting position and starts the movement loop.
     */
    constructor() {
        super().loadImage('assets/img/5_background/layers/4_clouds/1.png');
        this.x = 0 + Math.random() * 500;
        this.animate();
    }

    /**
     * Starts the movement loop, moving the cloud left at 60fps.
     */
    animate() {
        this.intervalId = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

    /**
     * Clears the movement interval.
     */
    destroy() {
        clearInterval(this.intervalId);
    }
}