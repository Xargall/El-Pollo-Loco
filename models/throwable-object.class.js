/**
 * Represents a thrown salsa bottle in the game world.
 * Flies in an arc, rotates during flight, and plays a splash animation on impact.
 *
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    /** @type {number} Interval ID for the vertical physics loop. */
    intervalId1;
    /** @type {number} Interval ID for the horizontal movement loop. */
    intervalId2;
    /** @type {number} Interval ID for the animation loop. */
    intervalId3;
    /** @type {string} Unique instance ID for sound registration. */
    id;

    /** @type {string[]} Animation frames for the bottle rotation during flight. */
    IMAGES_THROW = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    /** @type {string[]} Animation frames for the splash on impact. */
    IMAGES_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    /** @type {boolean} Whether the bottle has hit something and is playing the splash animation. */
    isSplashing = false;

    /** @type {Audio} Sound played when the bottle breaks on impact. */
    breakSound = new Audio('assets/audio/throwable/bottleBreak.mp3');

    /**
     * Creates a new ThrowableObject at the given position.
     * Loads all animation frames, generates a unique ID, and starts the throw and animation loops.
     *
     * @param {number} x - Horizontal starting position in the game world.
     * @param {number} y - Vertical starting position in the game world.
     */
    constructor(x, y) {
        super().loadImage(this.IMAGES_THROW[0]);
        this.loadImages(this.IMAGES_THROW);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.id = Math.random().toString(36).substr(2, 9);
        this.throw();
        this.animate();
    }

    /**
     * Starts the physics loops for the throw.
     * Vertical movement uses gravity, horizontal movement is constant.
     * Both loops stop while the bottle is splashing.
     */
    throw() {
        this.speedY = 30;

        this.intervalId1 = setInterval(() => {
            if (this.isSplashing) return;
            this.y -= this.speedY;
            this.speedY -= this.acceleration;

            if (this.y >= 380) {
                this.y = 380;
                this.hit();
                this.world.soundManager.play(`bottleBreak_${this.id}`);
            }
        }, 1000 / 25);

        this.intervalId2 = setInterval(() => {
            if (this.isSplashing) return;
            this.x += 10;
        }, 25);
    }

    /**
     * Starts the animation loop.
     * Plays the rotation animation during flight and the splash animation on impact.
     */
    animate() {
        this.intervalId3 = setInterval(() => {
            if (this.isSplashing) {
                if (this.currentImage < this.IMAGES_SPLASH.length) {
                    this.playAnimation(this.IMAGES_SPLASH);
                }
            } else {
                this.playAnimation(this.IMAGES_THROW);
            }
        }, 50);
    }

    /**
     * Clears all intervals and calls the parent destroy method.
     */
    destroy() {
        super.destroy();
        clearInterval(this.intervalId1);
        clearInterval(this.intervalId2);
        clearInterval(this.intervalId3);
    }

    /**
     * Triggers the splash state on impact.
     * Has no effect if already splashing, preventing multiple triggers.
     */
    hit() {
        if (this.isSplashing) return;
        this.isSplashing = true;
        this.currentImage = 0;
    }

    /**
     * Returns true if the splash animation has finished playing.
     *
     * @returns {boolean}
     */
    isSplashDone() {
        return this.isSplashing && this.currentImage >= this.IMAGES_SPLASH.length;
    }

    /**
     * Registers the bottle's break sound with the given SoundManager.
     * Uses the instance ID to avoid name collisions between multiple thrown bottles.
     *
     * @param {SoundManager} soundManager - The game's central sound manager.
     */
    registerSounds(soundManager) {
        soundManager.register(`bottleBreak_${this.id}`, this.breakSound, VOLUMES.bottleBreak, false);
    }
}