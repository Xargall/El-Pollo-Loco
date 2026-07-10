/**
 * Represents the Endboss enemy in the game.
 * Notices the player on approach, moves toward them, and performs
 * random jumps as an attack. Requires multiple bottle hits to defeat.
 *
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    /** @type {number} Height of the Endboss in pixels. */
    height = 400;
    /** @type {number} Width of the Endboss in pixels. */
    width = 250;
    /** @type {number} Vertical starting position. */
    y = 60;
    /** @type {number} Ground level Y position, used to reset after a jump. */
    groundY = 60;
    /** @type {boolean} Whether the Endboss is currently performing a jump. */
    isJumping = false;
    /** @type {boolean} Whether the Endboss has noticed the player and started moving. */
    hasNoticed = false;
    /** @type {Audio} Sound played when the Endboss notices the player or jumps. */
    alertSound = new Audio('assets/audio/endboss/endbossApproach.wav');
    /** @type {Audio} Sound played when the Endboss dies. */
    deadSound = new Audio('assets/audio/chicken/chickenDead2.mp3');
    /** @type {boolean} Ensures the death sound is only played once. */
    hasDeadSoundPlayed = false;
    /** @type {{top: number, bottom: number, left: number, right: number}} Hitbox offsets in pixels. */
    offset = { top: 140, bottom: 20, left: 20, right: 0 };
    /** @type {number} Interval ID for the movement loop. */
    intervalId1;
    /** @type {number} Interval ID for the animation loop. */
    intervalId2;
    /** @type {number} Timeout ID for the next scheduled jump, used for cleanup. */
    jumpTimeoutId;

    /** @type {string[]} Animation frames for the alert state. */
    IMAGES_ALERT = [
        "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
    ];

    /** @type {string[]} Animation frames for the walking state. */
    IMAGES_WALKING = [
        "assets/img/4_enemie_boss_chicken/1_walk/G1.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G2.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G3.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G4.png",
    ];

    /** @type {string[]} Animation frames for the attack (jump) state. */
    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    /** @type {string[]} Animation frames for the hurt state. */
    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    /** @type {string[]} Animation frames for the death state. */
    IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    /**
     * Creates a new Endboss instance.
     * Loads all animation frames and starts the animation and jump loops.
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        this.speed = 5;
        this.animate();
    }

    /**
     * Checks if the player has come close enough to trigger the Endboss.
     * Once triggered, starts the alert animation and sound.
     *
     * @param {number} characterX - The current horizontal position of the player.
     */
    checkTrigger(characterX) {
        if (!this.hasNoticed && characterX > this.x - 500) {
            this.hasNoticed = true;
            this.currentImage = 0;
            this.world.soundManager.play('endbossAlert');
        }
    }

    /**
     * Schedules the next jump after a random delay between 2 and 5 seconds.
     * Keeps rescheduling itself until the Endboss is dead.
     */
    scheduleNextJump() {
        let delay = 2000 + Math.random() * 3000;
        this.jumpTimeoutId = setTimeout(() => {
            if (this.hasNoticed && !this.isDead()) {
                this.triggerRandomJump();
            }
            if (!this.isDead()) {
                this.scheduleNextJump();
            }
        }, delay);
    }

    /**
     * Starts the boss behavior loops.
     *
     * Schedules the first jump, updates movement every 200 ms,
     * and updates the animation every 150 ms.
     */
    animate() {
        this.scheduleNextJump();
        this.intervalId1 = setInterval(() => this.handleMovement(), 200);
        this.intervalId2 = setInterval(() => this.handleAnimation(), 150);
    }

    /**
     * Handles the boss's movement.
     *
     * The boss moves left only after noticing the player
     * and while it is still alive.
     */
    handleMovement() {
        if (!this.isDead() && this.hasNoticed) this.moveLeft();
    }

    /**
     * Handles the boss's animation state.
     *
     * Animation priority:
     * 1. Death
     * 2. Hurt
     * 3. Jump attack
     * 4. Walking
     * 5. Alert
     */
    handleAnimation() {
        if (this.isDead()) {
            this.handleDeathAnimation();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isJumping) {
            this.playAnimation(this.IMAGES_ATTACK);
        } else if (this.hasNoticed) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.playAnimation(this.IMAGES_ALERT);
        }
    }

    handleDeathAnimation() {
        if (!this.hasDeadSoundPlayed) {
            this.world.soundManager.play('endbossDead');
            this.hasDeadSoundPlayed = true;
        }
        if (this.currentImage < this.IMAGES_DEAD.length) {
            this.playAnimation(this.IMAGES_DEAD);
        }
    }

    triggerRandomJump() {
        if (this.isJumping || !this.hasNoticed) return;
        this.isJumping = true;
        this.speedY = 25;
        this.currentImage = 0;
        this.world.soundManager.stop('endbossAlert');
        this.world.soundManager.play('endbossAlert');
        let jumpInterval = setInterval(() => this.tickJump(jumpInterval), 1000 / 25);
    }

    tickJump(jumpInterval) {
        this.y -= this.speedY;
        this.speedY -= 2;
        if (this.y >= this.groundY && this.speedY < 0) {
            this.y = this.groundY;
            this.isJumping = false;
            clearInterval(jumpInterval);
        }
    }

    /**
     * Clears all intervals and timeouts and calls the parent destroy method.
     */
    destroy() {
        super.destroy();
        clearInterval(this.intervalId1);
        clearInterval(this.intervalId2);
        clearTimeout(this.jumpTimeoutId);
    }

    /**
     * Registers the Endboss's sounds with the given SoundManager.
     *
     * @param {SoundManager} soundManager - The game's central sound manager.
     */
    registerSounds(soundManager) {
        soundManager.register('endbossAlert', this.alertSound, VOLUMES.endbossAlert, false);
        soundManager.register('endbossDead', this.deadSound, VOLUMES.endbossDead, false);
    }
}