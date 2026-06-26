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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkBottleCollisions();
      this.removeSplashedBottles();
      this.checkEndbossTrigger();
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
      } else if (this.character.isColliding(enemy) && !this.character.isHurt()) {  // only count hit on player if colliding with enemy and if Pepe hasn't been hurt before
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    })
  }

  checkBottleCollisions() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead() && !bottle.isSplashing && bottle.isColliding(enemy)) {
          enemy.hit();
          bottle.hit();
        }
      })
    })
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
        this.bottleCount++;
        this.bottleStatusBar.setPercentage(Math.min(this.bottleCount * 20, 100));
        return false;
      }
      return true;
    });

    this.level.coins = this.level.coins.filter((coin) => {
      if (this.character.isColliding(coin)) {
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

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.bottleStatusBar);
    this.addToMap(this.coinStatusBar);
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
}
