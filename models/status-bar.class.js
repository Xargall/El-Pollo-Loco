/**
 * Represents the player health bar displayed in the HUD.
 * Shows the character's current energy as a percentage bar.
 *
 * @extends DrawableObject
 */
class Statusbar extends DrawableObject {
    /** @type {string[]} Image paths for each fill level of the status bar (0% to 100%). */
    IMAGES = [
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ];
    /** @type {number} Current fill percentage of the status bar. */
    percentage = 100;

    /**
     * Creates a new Statusbar instance and positions it in the HUD.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the status bar to reflect the given percentage.
     *
     * @param {number} percentage - The fill level to display (0–100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the correct image index based on the current percentage.
     * Uses strict equality for 100% to ensure the full bar is shown only at max health.
     *
     * @returns {number} Index into the IMAGES array (0–5).
     */
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