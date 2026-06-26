class ThrowableObject extends MovableObject {

    IMAGES_THROW = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ]

    IMAGES_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    isSplashing = false;

    breakSound = new Audio('assets/audio/throwable/bottleBreak.mp3');

    constructor(x, y) {
        super().loadImage(this.IMAGES_THROW[0]);
        this.loadImages(this.IMAGES_THROW);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60,
            this.width = 50;
            this.breakSound.volume = 0.4;
        this.throw();
        this.animate();
    }

    throw() {
        this.speedY = 30;

        // Gravity function specifically for throw object => prevents bottle from falling after hit
        setInterval(() => {
            if (this.isSplashing) return;
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }, 1000 / 25)

        setInterval(() => {
            if (this.isSplashing) return;
            this.x += 10
        }, 25)

    }

    animate() {
        setInterval(() => {
            if (this.isSplashing) {
                if (this.currentImage < this.IMAGES_SPLASH.length) {
                    this.playAnimation(this.IMAGES_SPLASH);
                }
            } else {
                this.playAnimation(this.IMAGES_THROW);
            }
        }, 50)


    }
    hit() {
        if (this.isSplashing) return; // verhindert mehrfaches Auslösen
        this.isSplashing = true;
        this.currentImage = 0; // Splash-Sequenz von vorne starten
    }

    isSplashDone() {
        return this.isSplashing && this.currentImage >= this.IMAGES_SPLASH.length;
    }
}

