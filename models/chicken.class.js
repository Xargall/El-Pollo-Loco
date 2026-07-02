class Chicken extends MovableObject {
  y = 370;
  height = 60;
  width = 70;
  direction = -1;
  isAwake = false;
  energy = 20;
  deadSound = new Audio('assets/audio/chicken/chickenDead.mp3');
  hasDeadSoundPlayed = false;
  intervalId1;
  intervalId2;

  IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ['assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

  constructor() {
    super().loadImage("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 480 + Math.random() * 1800;
    this.speed = 0.15 + Math.random() * 0.3;
    this.animate();
    this.deadSound.volume = 0.4;
  }

  wakeUp() {
    if (this.isAwake) return;
    this.isAwake = true;
    this.pickRandomDirection();
    this.scheduleNextBehavior();
  }

  scheduleNextBehavior() {
    let delay = 1500 + Math.random() * 2500;
    setTimeout(() => {
      if (!this.isDead()) {
        this.pickRandomDirection();
        this.scheduleNextBehavior();
      }
    }, delay)
  }

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

  animate() {
    this.intervalId1 = setInterval(() => {
      if (this.isDead() || !this.isAwake || (this.world && this.world.gameWon)) return;
      if (this.direction === -1) {
        this.moveLeft();
        this.otherDirection = false;
      } else if (this.direction === 1) {
        this.moveRight();
        this.otherDirection = true;
      }
    }, 1000 / 60)

    this.intervalId2 = setInterval(() => {
      if (this.isDead()) {
        if (!this.hasDeadSoundPlayed) {
          this.deadSound.play().catch(() => { });
          this.hasDeadSoundPlayed = true;
        }
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isAwake && !(this.world && this.world.gameWon)) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200)
  }
  destroy() {
    super.destroy();
    clearInterval(this.intervalId1);
    clearInterval(this.intervalId2);
  }

}
