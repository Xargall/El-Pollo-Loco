/**
 * Base class for all movable objects in the game world.
 * Extends DrawableObject with physics, collision detection, and animation logic.
 *
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /** @type {number} Horizontal movement speed. */
  speed = 0.15;
  /** @type {boolean} Whether the object is facing left (mirrored). */
  otherDirection = false;
  /** @type {number} Vertical speed, used for gravity and jumping. */
  speedY = 0;
  /** @type {number} Gravity acceleration applied each physics tick. */
  acceleration = 2.5;
  /** @type {number} Current hit points. 0 means dead. */
  energy = 100;
  /** @type {number} Timestamp of the last hit in milliseconds. */
  lastHit = 0;
  /** @type {{top: number, bottom: number, left: number, right: number}} Hitbox offsets in pixels. */
  offset = { top: 0, bottom: 0, left: 0, right: 0 };
  /** @type {number} Interval ID for the gravity loop. */
  gravityIntervalId;

  /**
   * Starts the gravity loop, applying vertical acceleration each tick.
   * Only active while the object is above ground or moving upward.
   */
  applyGravity() {
    this.gravityIntervalId = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Returns true if the object is above the ground level.
   * ThrowableObjects always return true so they fall continuously.
   *
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Triggers a standard jump by setting the vertical speed.
   * Also resets the animation frame counter.
   */
  jump() {
    this.speedY = 30;
    this.currentImage = 0;
  }

  /**
   * Advances the animation by one frame from the given image array.
   *
   * @param {string[]} images - Array of image paths to cycle through.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the object to the right by its speed value.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by its speed value.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Returns true if this object's hitbox overlaps with another object's hitbox.
   *
   * @param {MovableObject} mo - The other object to check collision against.
   * @returns {boolean}
   */
  isColliding(mo) {
    return this.x + this.width - this.offset.right > mo.x + (mo.offset?.left ?? 0) &&
      this.y + this.height - this.offset.bottom > mo.y + (mo.offset?.top ?? 0) &&
      this.x + this.offset.left < mo.x + mo.width - (mo.offset?.right ?? 0) &&
      this.y + this.offset.top < mo.y + mo.height - (mo.offset?.bottom ?? 0);
  }

  /**
   * Returns true if this object is colliding with another object from above.
   * Used for stomp detection — requires downward movement and the object's
   * previous bottom edge to be at or above the target's top edge.
   *
   * @param {MovableObject} mo - The other object to check against.
   * @returns {boolean}
   */
  isCollidingFromAbove(mo) {
    return this.isColliding(mo) &&
      this.speedY < 0 &&
      (this.lastY + this.height - this.offset.bottom) <= (mo.y + (mo.offset?.top ?? 0) + 20);
  }

  /**
   * Triggers a small upward bounce, used after stomping an enemy.
   */
  bounce() {
    this.speedY = 20;
  }

  /**
   * Reduces energy by 10 on a hit.
   * If energy reaches 0, triggers the death state.
   * Otherwise records the hit timestamp for the hurt window.
   */
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

  /**
   * Returns true if the object's energy is zero.
   *
   * @returns {boolean}
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Returns true if the object was hit within the last second.
   *
   * @returns {boolean}
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Clears the gravity interval.
   * Should be called by subclass destroy() methods via super.destroy().
   */
  destroy() {
    clearInterval(this.gravityIntervalId);
  }
}