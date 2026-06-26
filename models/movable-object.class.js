class MovableObject extends DrawableObject {

  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25)
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {  // ThrowableObjects should walways fall
      return true;
    } else {
      return this.y < 180;
    }
  }

  jump() {
    this.speedY = 30;
    this.currentImage = 0;
  }


  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  // collition detection chicken & character
  isColliding(mo) {
    return this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
  }

  isCollidingFromAbove(mo) {
    return this.isColliding(mo) &&
      this.speedY < 0 &&
      (this.y + this.height) < (mo.y + mo.height * 0.65);
  }

  bounce() {
    this.speedY = 20; // kleiner Abprall nach dem Stomp
  }

  hit() {
    this.energy -= 10;
    if (this.energy <= 0) {
      this.energy = 0;
      this.speedY = 15;
      this.currentImage = 0;
    } else {
      this.lastHit = new Date().getTime();

    }
  }

  isDead() {
    return this.energy == 0;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit  //Difference in ms, Date() => milliseconds since 01.01.1970
    timepassed = timepassed / 1000; //Difference in seconds
    return timepassed < 1;
  }
}
