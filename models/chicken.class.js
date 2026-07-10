/**
 * Represents a regular Chicken enemy in the game.
 * Moves erratically once awake and takes multiple hits to defeat.
 *
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  /** @type {number} Fixed vertical position on the ground. */
  y = 370;
  /** @type {number} Height of the Chicken in pixels. */
  height = 60;
  /** @type {number} Width of the Chicken in pixels. */
  width = 70;
  /** @type {number} Current movement direction. -1 = left, 0 = idle, 1 = right. */
  direction = -1;
  /** @type {boolean} Whether the Chicken has been woken up and is actively moving. */
  isAwake = false;
  /** @type {number} Hit points. Chicken requires multiple hits to defeat. */
  energy = 20;
  /** @type {Audio} Sound played when the Chicken dies. */
  deadSound = new Audio('assets/audio/chicken/chickenDead.mp3');
  /** @type {boolean} Ensures the death sound is only played once. */
  hasDeadSoundPlayed = false;
  /** @type {number} Interval ID for the movement loop. */
  intervalId1;
  /** @type {number} Interval ID for the animation loop. */
  intervalId2;
  /** @type {string} Unique instance ID for sound registration. */
  id;

  /** @type {string[]} Animation frames for the walking state. */
  IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /** @type {string[]} Animation frames for the dead state. */
  IMAGES_DEAD = ['assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

  /**
   * Creates a new Chicken instance.
   * Loads walking and dead animations, sets a random horizontal
   * starting position, a random speed, and a unique ID.
   */
  constructor() {
    super().loadImage("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 480 + Math.random() * 1800;
    this.speed = 0.15 + Math.random() * 0.3;
    this.id = Math.random().toString(36).substr(2, 9);
    this.animate();
  }

  /**
   * Wakes up the Chicken and starts its movement behavior.
   * Has no effect if already awake.
   */
  wakeUp() {
    if (this.isAwake) return;
    this.isAwake = true;
    this.pickRandomDirection();
    this.scheduleNextBehavior();
  }

  /**
   * Schedules the next random direction change after a short delay.
   * Keeps rescheduling itself until the Chicken is dead.
   */
  scheduleNextBehavior() {
    let delay = 1500 + Math.random() * 2500;
    setTimeout(() => {
      if (!this.isDead()) {
        this.pickRandomDirection();
        this.scheduleNextBehavior();
      }
    }, delay)
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
   * Starts the enemy animation and movement loops.
   * 
   * - Movement is updated at approximately 60 FPS.
   * - Animation frames are updated every 200 ms.
   */
  animate() {
    this.intervalId1 = setInterval(() => this.handleMovement(), 1000 / 60);
    this.intervalId2 = setInterval(() => this.handleAnimation(), 200);
  }

  /**
   * Handles the movement logic of the enemy.
   *
   * The enemy will not move if:
   * - it is dead,
   * - it is not awake,
   * - or the game has already been won.
   *
   * Depending on the current direction, the enemy moves left or right
   * and updates its facing direction.
   */
  handleMovement() {
    if (this.isDead() || !this.isAwake || (this.world && this.world.gameWon)) return;

    if (this.direction === -1) {
      this.moveLeft();
      this.otherDirection = false;
    } else if (this.direction === 1) {
      this.moveRight();
      this.otherDirection = true;
    }
  }

  /**
   * Handles the enemy animation state.
   *
   * - Plays the death sound once and displays the death animation
   *   when the enemy dies.
   * - Plays the walking animation while the enemy is awake and
   *   the game has not been won.
   */
  handleAnimation() {
    if (this.isDead()) {
      if (!this.hasDeadSoundPlayed) {
        this.world.soundManager.play(`chickenDead_${this.id}`);
        this.hasDeadSoundPlayed = true;
      }
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isAwake && !(this.world && this.world.gameWon)) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Clears all intervals and calls the parent destroy method.
   */
  destroy() {
    super.destroy();
    clearInterval(this.intervalId1);
    clearInterval(this.intervalId2);
  }

  /**
   * Registers the Chicken's sounds with the given SoundManager.
   * Uses the instance ID to avoid name collisions between multiple instances.
   *
   * @param {SoundManager} soundManager - The game's central sound manager.
   */
  registerSounds(soundManager) {
    soundManager.register(`chickenDead_${this.id}`, this.deadSound, VOLUMES.chickenDead, false);
  }
}