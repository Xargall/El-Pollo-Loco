class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new Statusbar();
  throwableObjects = [];
  bottleCount = 0;
  coinCount = 0;
  bottleStatusBar = new BottleStatusbar();
  coinStatusBar = new CoinStatusbar();
  bossStatusBar = new EndbossStatusbar();
  gameWon = false;
  winImage = new Image();

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard
    this.winImage.src = 'assets/img/You won, you lost/You Win A.png';
    this.draw();
    this.setWorld();
    this.run();
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
    })
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
      if (enemy.isDead()) {
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
        this.coinStatusBar.setPercentage(Math.min(this.coinCount * 20, 100));
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

  checkChickenWakeup() {
    const firstChickenX = Math.min(
      ...this.level.enemies
        .filter((enemy) => enemy instanceof Chicken || enemy instanceof BabyChicken)
        .map((enemy) => enemy.x)
    );

    if (this.character.x > firstChickenX - 300) {
      this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Chicken || enemy instanceof BabyChicken) {
          enemy.wakeUp();
        }
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameWon) {
      this.ctx.drawImage(this.winImage, 0, 0, this.canvas.width, this.canvas.height);
      this.showRestartButton();
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
