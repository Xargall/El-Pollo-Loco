/**
 * Central game controller. Creates and manages all game objects,
 * runs the game loop, handles collisions, collectibles, sound, and game state.
 */
class World {
  /** @type {Character} The player character instance. */
  character = new Character();
  /** @type {Level} The currently active level. */
  level;
  /** @type {HTMLCanvasElement} The game canvas element. */
  canvas;
  /** @type {CanvasRenderingContext2D} The canvas 2D rendering context. */
  ctx;
  /** @type {Keyboard} The current keyboard input state. */
  keyboard;
  /** @type {number} Horizontal camera offset for scrolling. */
  camera_x = 0;
  /** @type {Statusbar} The player health bar. */
  statusBar = new Statusbar();
  /** @type {ThrowableObject[]} All currently active thrown bottles. */
  throwableObjects = [];
  /** @type {number} Number of bottles the player currently holds. */
  bottleCount = 0;
  /** @type {number} Number of coins collected so far. */
  coinCount = 0;
  /** @type {number} Total number of coins in the level. */
  totalCoins = 0;
  /** @type {BottleStatusbar} The bottle count status bar. */
  bottleStatusBar = new BottleStatusbar();
  /** @type {CoinStatusbar} The coin collection status bar. */
  coinStatusBar = new CoinStatusbar();
  /** @type {EndbossStatusbar} The endboss health bar. */
  bossStatusBar = new EndbossStatusbar();
  /** @type {boolean} Whether the player has won the level. */
  gameWon = false;
  /** @type {boolean} Whether the game is over. */
  gameOver = false;
  /** @type {HTMLImageElement} Preloaded win screen image, shared from game.js. */
  winImage;
  /** @type {HTMLImageElement} Preloaded game over screen image, shared from game.js. */
  gameOverImage;
  /** @type {Audio} Background music for the level. */
  backgroundMusic = new Audio('assets/audio/music/bgm/kf013818-la-casa.mp3');
  /** @type {DamageText[]} All currently active floating damage texts. */
  damageTexts = [];
  /** @type {number|null} Timestamp of the last bottle warning shown. */
  lastBottleWarning = null;
  /** @type {number|null} Timestamp of the last throw, used to enforce throw cooldown. */
  lastThrowTime = null;
  /** @type {number} Interval ID for the main game loop. */
  intervalId1;
  /** @type {number} Interval ID for the collectible and throw check loop. */
  intervalId2;
  /** @type {number} Number of extra lives remaining. */
  extraLives = 0;
  /** @type {HTMLImageElement} Icon displayed next to the extra life counter in the HUD. */
  pepeIcon = new Image();
  /** @type {SoundManager} The central sound manager instance. */
  soundManager = new SoundManager();
  /** @type {Audio} Sound played on game over. */
  gameOverSound = new Audio('assets/audio/sound/ui/game-over.mp3');
  /** @type {Audio} Sound played on winning. */
  gameWonSound = new Audio('assets/audio/sound/ui/game-won.mp3');
  /** @type {Audio} Sound played when an extra life is awarded. */
  oneUpSound = new Audio('assets/audio/sound/ui/1-up.mp3');
  /** @type {number} Timestamp of level start, used for the level banner fade-out. */
  levelBannerStart = new Date().getTime();
  /** @type {Audio} Sound played when bouncing on enemy. */
  bounceSound = new Audio('assets/audio/sound/ui/bounce.mp3');
  /** @type {boolean} Whether the draw loop should stop rendering. */
  isDestroyed = false;

  /**
   * Creates a new World instance and initializes all game systems.
   *
   * @param {HTMLCanvasElement} canvas - The game canvas element.
   * @param {Keyboard} keyboard - The keyboard input state object.
   * @param {Level} level - The level instance to play.
   */
  constructor(canvas, keyboard, level) {
    this.levelNumber = LEVELS.indexOf(currentLevelCreator) + 1;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.totalCoins = this.level.coins.length;
    this.pepeIcon.src = 'assets/icons/extraLife.png';
    this.winImage = winImage;
    this.gameOverImage = gameOverImage;
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Links all game objects to the world and registers their sounds
   * with the SoundManager.
   */
  setWorld() {
    this.character.world = this;
    this.character.registerSounds(this.soundManager);
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      enemy.registerSounds?.(this.soundManager);
    });
    this.soundManager.register('backgroundMusic', this.backgroundMusic, VOLUMES.backgroundMusic, true);
    this.soundManager.register('bounce', this.bounceSound, VOLUMES.bounce);
    this.level.bottles.forEach(b => b.registerSounds(this.soundManager));
    this.level.coins.forEach(c => c.registerSounds(this.soundManager));
    this.soundManager.register('gameOver', this.gameOverSound, VOLUMES.gameOver);
    this.soundManager.register('gameWon', this.gameWonSound, VOLUMES.gameWon);
    this.soundManager.register('oneUp', this.oneUpSound, VOLUMES.oneUp);
  }

  /**
   * Starts the main game loops.
   * The fast loop (60fps) handles collisions and game state checks.
   * The slow loop (200ms) handles throwing and collectible pickups.
   */
  run() {
    this.intervalId1 = setInterval(() => {
      this.checkCollisions();
      this.checkBottleCollisions();
      this.removeSplashedBottles();
      this.removeExpiredDamageTexts();
      this.checkEndbossTrigger();
      this.checkChickenWakeup();
      this.checkGameOver();
      this.checkEndbossDefeatStatus();
      this.checkAllEnemiesDefeated();
    }, 1000 / 60);
    this.intervalId2 = setInterval(() => {
      this.checkThrowObjects();
      this.checkCollectibleCollisions();
    }, 200);
  }

  /**
   * Checks collisions between the character and all active enemies.
   * Handles both stomp-from-above and side collisions.
   */
  checkCollisions() {
    if (this.character.isDead()) return;
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead()) return;
      if (enemy.isAwake === false) return;

      if (this.character.isCollidingFromAbove(enemy)) {
        this.character.bounce();
        enemy.hit();
        this.soundManager.stop('bounce');
        this.soundManager.play('bounce');
        this.damageTexts.push(new DamageText(enemy.x, enemy.y, "-1"));
        this.checkBossDefeat(enemy);
      } else if (this.character.isColliding(enemy) && !this.character.isHurt() && this.character.speedY <= 0) {
        this.character.hit();
        this.damageTexts.push(new DamageText(
          this.character.x + this.character.offset.left,
          this.character.y + this.character.offset.top,
          "-1"
        ));
        this.soundManager.stop('characterDamage');
        this.soundManager.play('characterDamage');
        this.statusBar.setPercentage(this.character.energy);
      }
    });
    this.character.lastY = this.character.y;
  }

  /**
   * Checks collisions between thrown bottles and all active enemies.
   * Triggers the bottle splash and enemy hit on contact.
   */
  checkBottleCollisions() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead() && !enemy.isHurt() && !bottle.isSplashing && bottle.isColliding(enemy)) {
          enemy.hit();
          bottle.hit();
          this.soundManager.play(`bottleBreak_${bottle.id}`);
          this.damageTexts.push(new DamageText(enemy.x, enemy.y, "-1"));
          this.checkBossDefeat(enemy);
        }
      });
    });
  }

  /**
   * Updates the boss health bar and checks if the endboss death animation is complete.
   * Acts as a fallback win trigger in case checkEndbossDefeatStatus fires late.
   *
   * @param {MovableObject} enemy - The enemy that was just hit.
   */
  checkBossDefeat(enemy) {
    if (enemy instanceof Endboss) {
      this.bossStatusBar.setPercentage(enemy.energy, enemy.maxEnergy);
      if (enemy.isDead() && enemy.currentImage >= enemy.IMAGES_DEAD.length) {
        this.gameWon = true;
        this.stopAllSounds();
      }
    }
  }

  /**
   * Checks if all enemies are defeated in levels without an endboss.
   * Triggers the win state if all enemies are dead.
   */
  checkAllEnemiesDefeated() {
    if (this.gameWon) return;
    const hasEndboss = this.level.enemies.some(e => e instanceof Endboss);
    if (hasEndboss) return;
    const allDead = this.level.enemies.length > 0 && this.level.enemies.every(e => e.isDead());
    if (allDead) {
      this.gameWon = true;
      this.stopAllSounds();
      this.soundManager.play('gameWon');
    }
  }

  /**
   * Handles the D-key throw input.
   * Enforces a cooldown between throws and shows a warning if no bottles are held.
   */
  checkThrowObjects() {
    if (this.character.isDead()) return;
    if (!this.keyboard.D) return;

    const now = Date.now();

    if (this.bottleCount === 0) {
      if (!this.lastBottleWarning || now - this.lastBottleWarning > 1500) {
        this.damageTexts.push(new DamageText(
          this.character.x + this.character.offset.left,
          this.character.y + this.character.offset.top,
          "No Bottles to throw!"
        ));
        this.lastBottleWarning = now;
      }
      return;
    }

    if (!this.lastThrowTime || now - this.lastThrowTime > 800) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      bottle.world = this;
      bottle.registerSounds(this.soundManager);
      this.throwableObjects.push(bottle);
      this.bottleCount--;
      this.lastThrowTime = now;
      this.bottleStatusBar.setPercentage(Math.min(this.bottleCount * 20, 100));
    }
  }

  /**
   * Checks for character collisions with collectible bottles and coins.
   * Collecting 75% of all coins awards one extra life.
   */
  checkCollectibleCollisions() {
    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (this.character.isColliding(bottle)) {
        bottle.pickupSound.play().catch(() => { });
        this.bottleCount++;
        this.bottleStatusBar.setPercentage(Math.min(this.bottleCount * 20, 100));
        return false;
      }
      return true;
    });

    this.level.coins = this.level.coins.filter((coin) => {
      if (this.character.isColliding(coin)) {
        coin.pickupSound.play().catch(() => { });
        this.coinCount++;
        this.coinStatusBar.setPercentage(calculatePercentage(this.coinCount, this.totalCoins));
        if (this.coinCount / this.totalCoins >= 0.75 && this.extraLives === 0) {
          this.extraLives = 1;
          this.soundManager.play('oneUp');
        }
        return false;
      }
      return true;
    });
  }

  /**
   * Forwards the character's current position to the endboss trigger check.
   */
  checkEndbossTrigger() {
    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss) {
      endboss.checkTrigger(this.character.x);
    }
  }

  /**
   * Polls the endboss death animation state and triggers the win condition
   * once the animation has fully completed.
   */
  checkEndbossDefeatStatus() {
    if (this.gameWon) return;
    const boss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (boss && boss.isDead() && boss.currentImage >= boss.IMAGES_DEAD.length) {
      this.gameWon = true;
      this.stopAllSounds();
      this.soundManager.play('gameWon');
    }
  }

  /**
   * Wakes up all chickens and baby chickens once the character
   * has moved past x position 400.
   */
  checkChickenWakeup() {
    if (this.character.x > 400) {
      this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Chicken || enemy instanceof BabyChicken) {
          enemy.wakeUp();
        }
      });
    }
  }

  /**
   * Checks whether the character's death animation has finished.
   * Consumes an extra life if available, otherwise triggers game over.
   */
  checkGameOver() {
    if (this.gameOver) return;
    if (this.character.isDead() && this.character.currentImage >= this.character.IMAGES_DEAD.length) {
      if (this.extraLives > 0) {
        this.extraLives--;
        this.character.energy = 100;
        this.statusBar.setPercentage(100);
      } else {
        this.gameOver = true;
        this.stopAllSounds();
        this.soundManager.play('gameOver');
      }
    }
  }

  /** Removes all bottles whose splash animation has finished. */
  removeSplashedBottles() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isSplashDone());
  }

  /** Removes all damage texts that have been visible for more than 1 second. */
  removeExpiredDamageTexts() {
    this.damageTexts = this.damageTexts.filter((dt) => !dt.isExpired());
  }

  /**
   * Main draw loop. Renders the win or game over screen if the game has ended,
   * otherwise renders the world, HUD, and foreground each frame.
   */
  draw() {
    if (this.isDestroyed) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.gameWon) {
      getGameWonState(this.ctx, this.camera_x, this.canvas, this.winImage, this.level);
      showWinButtons();
      requestAnimationFrame(() => this.draw());
      return;
    }
    if (this.gameOver) {
      getGameOverState(this.ctx, this.camera_x, this.canvas, this.gameOverImage, this.level);
      showGameOverButtons();
      requestAnimationFrame(() => this.draw());
      return;
    }
    drawWorld(this);
    drawHUD(this);
    drawForeground(this);
    requestAnimationFrame(() => this.draw());
  }

  /** Stops all registered sounds via the SoundManager. */
  stopAllSounds() {
    this.soundManager.stopAll();
  }

  /**
   * Cleans up all intervals, destroys all game objects, and stops all sounds.
   * Should be called before creating a new World instance.
   */
  destroy() {
    this.isDestroyed = true;
    clearInterval(this.intervalId1);
    clearInterval(this.intervalId2);
    this.character.destroy();
    this.level.enemies.forEach(e => e.destroy());
    this.level.clouds.forEach(c => c.destroy());
    this.throwableObjects.forEach(b => b.destroy());
    this.stopAllSounds();
  }
}