/**
 * Represents a Baby Chicken enemy in the game.
 * Smaller and slightly faster than a regular Chicken.
 * Dies in one hit and moves erratically once awake.
 * 
 * @extends MovableObject
 */
class BabyChicken extends MovableObject {
    /** @type {number} Fixed vertical position on the ground. */
    y = 390;
    /** @type {number} Height of the Baby Chicken in pixels. */
    height = 40;
    /** @type {number} Width of the Baby Chicken in pixels. */
    width = 50;
    /** @type {number} Current movement direction. -1 = left, 0 = idle, 1 = right. */
    direction = -1;
    /** @type {boolean} Whether the Baby Chicken has been woken up and is actively moving. */
    isAwake = false;
    /** @type {Audio} Sound played when the Baby Chicken dies. */
    deadSound = new Audio('assets/audio/chicken/chickenDead2.mp3');
    /** @type {boolean} Ensures the death sound is only played once. */
    hasDeadSoundPlayed = false;
    intervalId1;
    intervalId2;

    /** @type {string[]} Animation frames for the walking state. */
    IMAGES_WALKING = [
        "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ];

    /** @type {string[]} Animation frames for the dead state. */
    IMAGES_DEAD = [
        "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"
    ];

    /**
     * Creates a new BabyChicken instance.
     * Loads walking and dead animations, sets a random horizontal
     * starting position and a random speed.
     */
    constructor() {
        super().loadImage("assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 200 + Math.random() * 1800;
        this.speed = 0.3 + Math.random() * 0.4;
        this.animate();
        this.deadSound.volume = 0.4;
    }

    /**
     * Wakes up the Baby Chicken and starts its movement behavior.
     * Has no effect if already awake.
     */
    wakeUp() {
        if (this.isAwake) return;
        this.isAwake = true;
        this.scheduleNextBehavior();
    }

    /**
     * Schedules the next random direction change after a short delay.
     * Keeps rescheduling itself until the Baby Chicken is dead.
     */
    scheduleNextBehavior() {
        let delay = 1000 + Math.random() * 2000;
        setTimeout(() => {
            if (!this.isDead()) {
                this.pickRandomDirection();
                this.scheduleNextBehavior();
            }
        }, delay);
    }

    /**
     * Randomly picks a movement direction.
     * 50% chance to move left, 30% to move right, 20% to stand idle.
     */
    pickRandomDirection() {
        let choice = Math.random();
        if (choice < 0.5) {
            this.direction = -1;
        } else if (choice < 0.8) {
            this.direction = 1;
        } else {
            this.direction = 0;
        }
    }

    /**
     * Starts the animation and movement loops for the Baby Chicken.
     * Movement runs at 60fps, animation frames update every 150ms.
     */
    animate() {
        this.intervalId1 = setInterval(() => {
            if (this.isDead() || (this.world && this.world.gameWon)) return;
            if (this.direction === -1) {
                this.moveLeft();
                this.otherDirection = false;
            } else if (this.direction === 1) {
                this.moveRight();
                this.otherDirection = true;
            }
        }, 1000 / 60);

        this.intervalId2 = setInterval(() => {
            if (this.isDead()) {
                if (!this.hasDeadSoundPlayed) {
                    this.deadSound.play().catch(() => { });
                    this.hasDeadSoundPlayed = true;
                }
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isAwake) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }
    destroy() {
        super.destroy();
        clearInterval(this.intervalId1);
        clearInterval(this.intervalId2);
    }

    /**
     * Kills the Baby Chicken instantly on any hit.
     * Overrides the default hit logic — one hit is always lethal.
     */
    hit() {
        this.energy = 0;
    }
}