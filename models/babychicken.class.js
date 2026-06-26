class BabyChicken extends MovableObject {
    y = 390;
    height = 40;
    width = 50;
    direction = -1; // -1 = links, 1 = rechts, 0 = steht

    IMAGES_WALKING = [
        "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ];

    IMAGES_DEAD = [
        "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"
    ];

    constructor() {
        super().loadImage("assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 200 + Math.random() * 1800;
        this.speed = 0.3 + Math.random() * 0.4; // etwas schneller als normale Hühner (0.15-0.45)
        this.animate();
        this.scheduleNextBehavior();
    }

    scheduleNextBehavior() {
        let delay = 1000 + Math.random() * 2000; // etwas hektischer als normale Hühner
        setTimeout(() => {
            if (!this.isDead()) {
                this.pickRandomDirection();
                this.scheduleNextBehavior();
            }
        }, delay);
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
        setInterval(() => {
            if (this.isDead()) return;
            if (this.direction === -1) {
                this.moveLeft();
                this.otherDirection = false;
            } else if (this.direction === 1) {
                this.moveRight();
                this.otherDirection = true;
            }
        }, 1000 / 60)

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150) // etwas schnellere Lauf-Animation als normale Hühner (200ms)
    }

    hit() {
        this.energy = 0; // ein Treffer reicht, genau wie bei Chicken
    }
}
