class Character extends MovableObject {
  height = 250;
  width = 120;
  y = 80;
  speed = 10;

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

  IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];

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

  IMAGES_DEAD = [
    'assets/img/2_character_pepe/5_dead/D-51.png',
    'assets/img/2_character_pepe/5_dead/D-52.png',
    'assets/img/2_character_pepe/5_dead/D-53.png',
    'assets/img/2_character_pepe/5_dead/D-54.png',
    'assets/img/2_character_pepe/5_dead/D-55.png',
    'assets/img/2_character_pepe/5_dead/D-56.png',
    'assets/img/2_character_pepe/5_dead/D-57.png',
  ]

  IMAGES_HURT = [
    'assets/img/2_character_pepe/4_hurt/H-41.png',
    'assets/img/2_character_pepe/4_hurt/H-42.png',
    'assets/img/2_character_pepe/4_hurt/H-43.png',
  ]

  idleStart = new Date().getTime();

  world;



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

  isLongIdle() {
    let timepassed = (new Date().getTime() - this.idleStart) / 1000;
    return timepassed > 5;
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
        this.idleStart = new Date().getTime(); // Bewegung zurücksetzen
      }

      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        this.idleStart = new Date().getTime();
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
        this.idleStart = new Date().getTime();
      }

      this.world.camera_x = -this.x + 100;
    }, 1000 / 60)

    // Dead-Animation: einmalig, langsam
    setInterval(() => {
      if (this.isDead() && this.currentImage < this.IMAGES_DEAD.length) {
        this.playAnimation(this.IMAGES_DEAD);
      }
    }, 200)

    // Hurt-Animation: schnell, kurzer Effekt
    setInterval(() => {
      if (!this.isDead() && this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      }
    }, 100)

    // Jump-Animation: eigener, langsamerer Takt
    setInterval(() => {
      if (!this.isDead() && !this.isHurt() && this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      }
    }, 90)

    // Walking-Animation
    setInterval(() => {
      if (!this.isDead() && !this.isHurt() && !this.isAboveGround() &&
        (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 150)

    // Idle / Idle-Long-Animation
    setInterval(() => {
      if (!this.isDead() && !this.isHurt() && !this.isAboveGround() &&
        !(this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
        if (this.isLongIdle()) {
          this.playAnimation(this.IMAGES_IDLE_LONG);
        } else {
          this.playAnimation(this.IMAGES_IDLE);
        }
      }
    }, 200)
  }

}
