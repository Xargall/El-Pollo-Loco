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

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard
    this.level = level;
    this.totalCoins = this.level.coins.length;
    this.winImage.src = 'assets/img/You won, you lost/You Win A.png';
    this.gameOverImage.src = 'assets/img/You won, you lost/You lost.png';
    this.draw();
    this.setWorld();
    this.run();
    this.backgroundMusic.volume = 0.2;
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    })
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkBottleCollisions();
      this.removeSplashedBottles();
      this.checkEndbossTrigger();
      this.checkChickenWakeup();
      this.checkGameOver();
      this.checkEndbossDefeatStatus();
    }, 1000 / 60)
    setInterval(() => {
      this.checkThrowObjects();
      this.checkCollectibleCollisions();
    }, 200)
  }

  removeSplashedBottles() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isSplashDone());
  }

  checkCollisions() {
    if (this.character.isDead()) return;
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead()) return;
      if (enemy.isAwake === false) return;

      if (this.character.isCollidingFromAbove(enemy)) {
        this.character.bounce();
        enemy.hit();
        this.checkBossDefeat(enemy);
      } else if (this.character.isColliding(enemy) && !this.character.isHurt()) {  // only count hit on player if colliding with enemy and if Pepe hasn't been hurt before
        this.character.hit();
        this.character.damageSound.currentTime = 0;
        this.character.damageSound.play().catch(() => { });;
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
          this.checkBossDefeat(enemy);
        }
      })
    })
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

  checkThrowObjects() {
    if (this.character.isDead()) return;

    if (this.keyboard.D && this.bottleCount > 0) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObjects.push(bottle);
      this.bottleCount--;
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
        let percentage = (this.coinCount / this.totalCoins) * 100;
        this.coinStatusBar.setPercentage(percentage);
        return false;
      }
      return true;
    });
  }

  checkEndbossTrigger() {
    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss)
    if (endboss) {
      endboss.checkTrigger(this.character.x);
    }
  }


  checkEndbossDefeatStatus() {
    const boss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (this.gameWon) return;
    if (boss) {
      if (boss.isDead() && boss.currentImage >= boss.IMAGES_DEAD.length) {
        this.gameWon = true;
        this.stopAllSounds();
      }
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

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameWon) {
      this.ctx.translate(this.camera_x, 0)
      this.addObjectsToMap(this.level.backgroundObjects);
      this.ctx.translate(-this.camera_x, 0);

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.winImage, 60, 40, 600, 400);
      this.showWinButtons();
      return;
    }

    if (this.gameOver) {
      this.ctx.translate(this.camera_x, 0);
      this.addObjectsToMap(this.level.backgroundObjects);
      this.ctx.translate(-this.camera_x, 0);

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.gameOverImage, 60, 40, 600, 400);
      this.showGameOverButtons();
      return;
    }

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.bottleStatusBar);
    this.addToMap(this.coinStatusBar);

    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss && endboss.hasNoticed) {
      this.addToMap(this.bossStatusBar);
    }

    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);

    requestAnimationFrame(() => this.draw());
    this.ctx.translate(-this.camera_x, 0);
  }

  // Add multiple movable objects to the canvas
  addObjectsToMap(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  // Add a movable object to the canvas
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);

    }
    mo.draw(this.ctx)
    mo.drawHitbox(this.ctx)

    if (mo.otherDirection) {
      this.flipReverse(mo)
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipReverse(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  showRestartButton() {
    document.getElementById("restartButton").style.display = "block";
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
    this.level.enemies.forEach((enemy) => {
      if (enemy.deadSound) {
        enemy.deadSound.pause();
        enemy.deadSound.currentTime = 0;
      }
      if (enemy.alertSound) {
        enemy.alertSound.pause();
        enemy.alertSound.currentTime = 0;
      }
    })
  }
}
