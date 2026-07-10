/**
 * Represents the coin status bar displayed in the HUD.
 * Shows the current coin collection progress as a percentage bar.
 *
 * @extends DrawableObject
 */
class CoinStatusbar extends DrawableObject {
    /** @type {string[]} Image paths for each fill level of the status bar (0% to 100%). */
    IMAGES = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
    ];
    /** @type {number} Current fill percentage of the status bar. */
    percentage = 0;

    /**
     * Creates a new CoinStatusbar instance and positions it in the HUD.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 100;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
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
}