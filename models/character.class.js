/**
 * Represents the player character Pepe.
 * Handles movement, animation, sound, and input processing.
 *
 * @extends MovableObject
 */
class Character extends MovableObject {
  /** @type {number} Height of the character in pixels. */
  height = 250;
  /** @type {number} Width of the character in pixels. */
  width = 120;
  /** @type {number} Vertical starting position. */
  y = 80;
  /** @type {number} Vertical position from the previous frame, used for stomp detection. */
  lastY = 80;
  /** @type {number} Horizontal movement speed. */
  speed = 10;
  /** @type {number} Interval ID for the movement and input loop. */
  intervalId1;
  /** @type {number} Interval ID for the death animation loop. */
  intervalId2;
  /** @type {number} Interval ID for the hurt animation loop. */
  intervalId3;
  /** @type {number} Interval ID for the jump animation loop. */
  intervalId4;
  /** @type {number} Interval ID for the walking animation loop. */
  intervalId5;
  /** @type {number} Interval ID for the idle animation loop. */
  intervalId6;
  /** @type {{top: number, bottom: number, left: number, right: number}} Hitbox offsets in pixels. */
  offset = { top: 110, bottom: 10, left: 25, right: 30, };
  /** @type {string[]} Animation frames for the short idle state. */
  IMAGES_IDLE = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  /** @type {string[]} Animation frames for the long idle (snoring) state. */
  IMAGES_IDLE_LONG = [
    'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];
  /** @type {string[]} Animation frames for the walking state. */
  IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];
  /** @type {string[]} Animation frames for the jumping state. */
  IMAGES_JUMPING = [
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
    "assets/img/2_character_pepe/3_jump/J-36.png",
    "assets/img/2_character_pepe/3_jump/J-37.png",
    "assets/img/2_character_pepe/3_jump/J-38.png",
    "assets/img/2_character_pepe/3_jump/J-39.png",
  ];
  /** @type {string[]} Animation frames for the death state. */
  IMAGES_DEAD = [
    'assets/img/2_character_pepe/5_dead/D-51.png',
    'assets/img/2_character_pepe/5_dead/D-52.png',
    'assets/img/2_character_pepe/5_dead/D-53.png',
    'assets/img/2_character_pepe/5_dead/D-54.png',
    'assets/img/2_character_pepe/5_dead/D-55.png',
    'assets/img/2_character_pepe/5_dead/D-56.png',
    'assets/img/2_character_pepe/5_dead/D-57.png',
  ]
  /** @type {string[]} Animation frames for the hurt state. */
  IMAGES_HURT = [
    'assets/img/2_character_pepe/4_hurt/H-41.png',
    'assets/img/2_character_pepe/4_hurt/H-42.png',
    'assets/img/2_character_pepe/4_hurt/H-43.png',
  ]
  /** @type {Audio} Sound played while walking. */
  walkSound = new Audio('assets/audio/character/characterRun.mp3');
  /** @type {Audio} Sound played when jumping. */
  jumpSound = new Audio('assets/audio/character/characterJump.wav');
  /** @type {Audio} Sound played during long idle. */
  snoringSound = new Audio('assets/audio/character/characterSnoring.mp3');
  /** @type {Audio} Sound played when taking damage. */
  damageSound = new Audio('assets/audio/character/characterDamage.mp3');
  /** @type {Audio} Sound played on death. */
  deadSound = new Audio('assets/audio/character/characterDead.wav');
  /** @type {number} Timestamp of the last movement, used for idle detection. */
  idleStart = new Date().getTime();
  /** @type {boolean} Ensures the death sound is only played once. */
  hasDeadSoundPlayed = false;
  /** @type {World} Reference to the game world, set externally after construction. */
  world;

  /**
   * Creates a new Character instance.
   * Loads all animation frames, applies gravity, and starts the animation loops.
   */
  constructor() {
    super().loadImage("assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();
  }

  /**
   * Returns true if the character has been idle for more than 5 seconds.
   *
   * @returns {boolean}
   */
  isLongIdle() {
    let timepassed = (new Date().getTime() - this.idleStart) / 1000;
    return timepassed > 5;
  }

  /**
   * Starts all animation and movement intervals.
   * Handles input, camera tracking, and all animation states
   * (movement, death, hurt, jump, walk, idle).
   */
  animate() {
    this.intervalId1 = setInterval(() => {
      if (this.isDead() || this.world.gameWon) return;

      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
        this.idleStart = new Date().getTime();
      }

      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        this.idleStart = new Date().getTime();
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        const noBottlesLeft = this.world.bottleCount === 0 && this.world.level.bottles.length === 0;
        const boss = this.world.level.enemies.find(e => e instanceof Endboss);
        const bossAlive = boss && !boss.isDead();

        if (noBottlesLeft && bossAlive) {
          this.jumpHigh();
        } else {
          this.jump();
        }
        this.world.soundManager.stop('characterJump');
        this.world.soundManager.play('characterJump');
        this.idleStart = new Date().getTime();
      }

      this.world.camera_x = -this.x + 100;
    }, 1000 / 60)

    this.intervalId2 = setInterval(() => {
      if (this.isDead() && this.currentImage < this.IMAGES_DEAD.length) {
        if (!this.hasDeadSoundPlayed) {
          this.world.soundManager.play('characterDead');
          this.hasDeadSoundPlayed = true;
        }
        if (this.currentImage < this.IMAGES_DEAD.length) {
          this.playAnimation(this.IMAGES_DEAD);
        }
      }
    }, 200)

    this.intervalId3 = setInterval(() => {
      if (!this.isDead() && !this.world.gameWon && this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      }
    }, 100)

    this.intervalId4 = setInterval(() => {
      if (!this.isDead() && !this.world.gameWon && !this.isHurt() && this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      }
    }, 90)

    this.intervalId5 = setInterval(() => {
      if (!this.isDead() && !this.world.gameWon && !this.isHurt() && !this.isAboveGround() &&
        (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
        if (!this.world.soundManager.isPlaying('characterWalk')) {
          this.world.soundManager.play('characterWalk');
        }
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.world.soundManager.stop('characterWalk');
      }
    }, 150)

    this.intervalId6 = setInterval(() => {
      if (!this.isDead() && !this.world.gameWon && !this.isHurt() && !this.isAboveGround() &&
        !(this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
        if (this.isLongIdle()) {
          if (!this.world.soundManager.isPlaying('characterSnoring')) {
            this.world.soundManager.play('characterSnoring');
          }
          this.playAnimation(this.IMAGES_IDLE_LONG);
        } else {
          if (this.world.soundManager.isPlaying('characterSnoring')) {
            this.world.soundManager.stop('characterSnoring');
          }
          this.playAnimation(this.IMAGES_IDLE);
        }
      } else {
        if (!this.world.soundManager.isPlaying('characterSnoring')) {
          this.world.soundManager.stop('characterSnoring');
        }
      }
    }, 200)
  }

  /**
   * Triggers a high jump with increased speedY.
   * Used when no bottles are left and the endboss is alive.
   */
  jumpHigh() {
    this.speedY = 42;
  }

  /**
   * Clears all animation intervals and calls the parent destroy method.
   */
  destroy() {
    super.destroy();
    clearInterval(this.intervalId1);
    clearInterval(this.intervalId2);
    clearInterval(this.intervalId3);
    clearInterval(this.intervalId4);
    clearInterval(this.intervalId5);
    clearInterval(this.intervalId6);
  }

  /**
   * Registers all character sounds with the given SoundManager.
   *
   * @param {SoundManager} soundManager - The game's central sound manager.
   */
  registerSounds(soundManager) {
    soundManager.register('characterWalk', this.walkSound, VOLUMES.characterWalk, true);
    soundManager.register('characterJump', this.jumpSound, VOLUMES.characterJump, false);
    soundManager.register('characterSnoring', this.snoringSound, VOLUMES.characterSnoring, true);
    soundManager.register('characterDamage', this.damageSound, VOLUMES.characterDamage, false);
    soundManager.register('characterDead', this.deadSound, VOLUMES.characterDead, false);
  }
}