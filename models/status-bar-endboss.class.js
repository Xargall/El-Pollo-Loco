/**
 * Represents the Endboss health bar displayed in the HUD.
 * Only visible once the Endboss has noticed the player.
 * Calculates fill percentage from current and maximum energy values.
 *
 * @extends DrawableObject
 */
class EndbossStatusbar extends DrawableObject {
    /** @type {string[]} Image paths for each fill level of the status bar (0% to 100%). */
    IMAGES = [
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
    ];
    /** @type {number} Current fill percentage of the status bar. */
    percentage = 100;

    /**
     * Creates a new EndbossStatusbar instance and positions it in the HUD.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 480;
        this.y = 30;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100, 100);
    }

    /**
     * Updates the status bar based on the Endboss's current and maximum energy.
     *
     * @param {number} currentEnergy - The Endboss's current energy.
     * @param {number} maxEnergy - The Endboss's maximum energy.
     */
    setPercentage(currentEnergy, maxEnergy) {
        let percentage = (currentEnergy / maxEnergy) * 100;
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the correct image index based on the current percentage.
     *
     * @returns {number} Index into the IMAGES array (0–5).
     */
    resolveImageIndex() {
        if (this.percentage >= 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}