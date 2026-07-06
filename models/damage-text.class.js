/**
 * Represents a floating damage text label in the game world.
 * Displayed at a given position and automatically expires after 1 second.
 */
class DamageText {
    /** @type {number} Horizontal position in the game world. */
    x;
    /** @type {number} Vertical position in the game world. */
    y;
    /** @type {string} Text content to display, e.g. "-1" or "No Bottles to throw!". */
    text;
    /** @type {number} Timestamp of creation in milliseconds. */
    createdAt;

    /**
     * Creates a new DamageText instance.
     *
     * @param {number} x - Horizontal position in the game world.
     * @param {number} y - Vertical position in the game world.
     * @param {string} text - The text to display.
     */
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.createdAt = new Date().getTime();
    }

    /**
     * Returns true if the damage text has been visible for more than 1 second.
     *
     * @returns {boolean}
     */
    isExpired() {
        let timepassed = (new Date().getTime() - this.createdAt) / 1000;
        return timepassed > 1;
    }
}