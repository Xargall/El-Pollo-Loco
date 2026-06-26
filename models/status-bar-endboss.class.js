class EndbossStatusbar extends DrawableObject {

    IMAGES = [
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
    ]

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 480;
        this.y = 10;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100, 100);
    }

    setPercentage(currentEnergy, maxEnergy) {
        let percentage = (currentEnergy / maxEnergy) * 100;
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 0) {
            return 1;
        } else {
            return 0;
        }
    }

}