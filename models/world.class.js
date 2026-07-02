class World {
  character = new Character();
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new Statusbar();
  throwableObjects = [];
  bottleCount = 0;
  coinCount = 0;
  totalCoins = 0;
  bottleStatusBar = new BottleStatusbar();
  coinStatusBar = new CoinStatusbar();
  bossStatusBar = new EndbossStatusbar();
  gameWon = false;
  winImage = new Image();
  gameOver = false;
  gameOverImage = new Image();
  backgroundMusic = new Audio('assets/audio/music/bgm/kf013818-la-casa.wav');
  damageTexts = [];
  lastNoBottleWarning = null;
  lastBottleWarning = null;
  lastThrowTime = null;
  intervalId1;
  intervalId2;

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.totalCoins = this.level.coins.length;
    this.winImage.src = 'assets/img/You won, you lost/You Win A.png';
    this.gameOverImage.src = 'assets/img/You won, you lost/You lost.png';
    this.backgroundMusic.volume = 0.2;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

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

  checkCollisions() {
    if (this.character.isDead()) return;
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead()) return;
      if (enemy.isAwake === false) return;

      if (this.character.isCollidingFromAbove(enemy)) {
        this.character.bounce();
        enemy.hit();
        this.damageTexts.push(new DamageText(enemy.x, enemy.y, "-1"));
        this.checkBossDefeat(enemy);
      } else if (this.character.isColliding(enemy) && !this.character.isHurt() && this.character.speedY <= 0) {
        this.character.hit();
        this.damageTexts.push(new DamageText(
          this.character.x + this.character.offset.left,
          this.character.y + this.character.offset.top,
          "-1"
        ));
        this.character.damageSound.currentTime = 0;
        this.character.damageSound.play().catch(() => { });
        this.statusBar.setPercentage(this.character.energy);
      }
    });
    this.character.lastY = this.character.y;
  }

  checkBottleCollisions() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead() && !enemy.isHurt() && !bottle.isSplashing && bottle.isColliding(enemy)) {
          enemy.hit();
          bottle.hit();
          bottle.breakSound.play().catch(() => { });
          this.damageTexts.push(new DamageText(enemy.x, enemy.y, "-1"));
          this.checkBossDefeat(enemy);
        }
      });
    });
  }

  checkBossDefeat(enemy) {
    if (enemy instanceof Endboss) {
      this.bossStatusBar.setPercentage(enemy.energy, enemy.maxEnergy);
      if (enemy.isDead() && enemy.currentImage >= enemy.IMAGES_DEAD.length) {
        this.gameWon = true;
        this.stopAllSounds();
      }
    }
  }

  checkAllEnemiesDefeated() {
    if (this.gameWon) return;
    const hasEndboss = this.level.enemies.some(e => e instanceof Endboss);
    if (hasEndboss) return;
    const allDead = this.level.enemies.every(e => e.isDead());
    if (allDead) {
      this.gameWon = true;
      this.stopAllSounds();
    }
  }

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
      this.throwableObjects.push(bottle);
      this.bottleCount--;
      this.lastThrowTime = now;
      this.bottleStatusBar.setPercentage(Math.min(this.bottleCount * 20, 100));
    }
  }

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
        return false;
      }
      return true;
    });
  }

  checkEndbossTrigger() {
    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss) {
      endboss.checkTrigger(this.character.x);
    }
  }

  checkEndbossDefeatStatus() {
    if (this.gameWon) return;
    const boss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (boss && boss.isDead() && boss.currentImage >= boss.IMAGES_DEAD.length) {
      this.gameWon = true;
      this.stopAllSounds();
    }
  }

  checkChickenWakeup() {
    if (this.character.x > 400) {
      this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Chicken || enemy instanceof BabyChicken) {
          enemy.wakeUp();
        }
      });
    }
  }

  checkGameOver() {
    if (this.gameOver) return;
    if (this.character.isDead() && this.character.currentImage >= this.character.IMAGES_DEAD.length) {
      this.gameOver = true;
      this.stopAllSounds();
    }
  }

  removeSplashedBottles() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isSplashDone());
  }

  removeExpiredDamageTexts() {
    this.damageTexts = this.damageTexts.filter((dt) => !dt.isExpired());
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameWon) {
      getGameWonState(this.ctx, this.camera_x, this.canvas, this.winImage, this.level);
      this.showWinButtons();
      return;
    }

    if (this.gameOver) {
      getGameOverState(this.ctx, this.camera_x, this.canvas, this.gameOverImage, this.level);
      this.showGameOverButtons();
      return;
    }

    this.drawWorld();
    this.drawHUD();
    this.drawForeground();

    requestAnimationFrame(() => this.draw());
  }

  drawWorld() {
    this.ctx.translate(this.camera_x, 0);
    addObjectsToMap(this.ctx, this.level.backgroundObjects);
    addObjectsToMap(this.ctx, this.level.bottles);
    addObjectsToMap(this.ctx, this.level.coins);
    addObjectsToMap(this.ctx, this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
  }

  drawHUD() {
    addToMap(this.ctx, this.statusBar);
    addToMap(this.ctx, this.bottleStatusBar);
    addToMap(this.ctx, this.coinStatusBar);

    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss && endboss.hasNoticed) {
      addToMap(this.ctx, this.bossStatusBar);
    }
  }

  drawForeground() {
    this.ctx.translate(this.camera_x, 0);
    addToMap(this.ctx, this.character);
    addObjectsToMap(this.ctx, this.throwableObjects);
    addObjectsToMap(this.ctx, this.level.enemies);
    drawDamageTexts(this.ctx, this.damageTexts);
    this.ctx.translate(-this.camera_x, 0);
  }

  showGameOverButtons() {
    document.getElementById("restartButton").style.display = "inline-block";
    document.getElementById("mainMenuButton").style.display = "inline-block";
    document.getElementById("nextLevelButton").style.display = "none";
    document.getElementById("endScreenButtons").style.display = "flex";
  }

  showWinButtons() {
    document.getElementById("restartButton").style.display = "none";
    document.getElementById("mainMenuButton").style.display = "inline-block";
    document.getElementById("nextLevelButton").style.display = "inline-block";
    document.getElementById("endScreenButtons").style.display = "flex";
  }

  stopAllSounds() {
    this.character.walkSound.pause();
    this.character.walkSound.currentTime = 0;
    this.character.snoringSound.pause();
    this.character.snoringSound.currentTime = 0;
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
    this.level.enemies.forEach((enemy) => {
      if (enemy.deadSound) {
        enemy.deadSound.pause();
        enemy.deadSound.currentTime = 0;
      }
      if (enemy.alertSound) {
        enemy.alertSound.pause();
        enemy.alertSound.currentTime = 0;
      }
    });
  }

  destroy() {
    clearInterval(this.intervalId1);
    clearInterval(this.intervalId2);
    this.character.destroy();
    this.level.enemies.forEach(e => e.destroy());
    this.level.clouds.forEach(c => c.destroy());
    this.throwableObjects.forEach(b => b.destroy());
    this.stopAllSounds();
  }
}
