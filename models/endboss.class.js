class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;
    groundY = 60;
    isJumping = false;
    hasNoticed = false;


    IMAGES_ALERT = [
        "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
    ];

    IMAGES_WALKING = [
        "assets/img/4_enemie_boss_chicken/1_walk/G1.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G2.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G3.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G4.png",
    ];

    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT)
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        this.speed = 5;
        this.animate();

    }

    checkTrigger(characterX) {
        if (!this.hasNoticed && characterX > this.x - 500) {
            this.hasNoticed = true;
            this.currentImage = 0;
        }

    }

    triggerRandomJump() {
        if (this.isJumping || !this.hasNoticed) return;
        this.isJumping = true;
        this.speedY = 25;

        let jumpInterval = setInterval(() => {
            this.y -= this.speedY;
            this.speedY -= 2;

            if (this.y >= this.groundY && this.speedY < 0) {
                this.y = this.groundY;
                this.isJumping = false;
                clearInterval(jumpInterval);
            }
        }, 1000 / 25)
    }

    scheduleNextJump() {
        let delay = 2000 + Math.random() * 3000; // zwischen 2 und 5 Sekunden
        setTimeout(() => {
            if (this.hasNoticed) {
                this.triggerRandomJump();
            }
            this.scheduleNextJump(); // ruft sich selbst wieder auf
        }, delay);
    }




    animate() {
        this.scheduleNextJump();

        setInterval(() => {
            if (this.hasNoticed) {
                this.moveLeft();
            }
        }, 200)

        setInterval(() => {
            if (this.hasNoticed) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_ALERT);
            }
        }, 150)
    }
}
