/**
 * Represents a collectible coin in the game world.
 * When picked up by the character, it increases the coin count
 * and may trigger an extra life at 75% collection.
 *
 * @extends Collectible
 */
class CollectibleCoin extends Collectible {
    /** @type {Audio} Sound played when the coin is picked up. */
    pickupSound = new Audio('assets/audio/collectibles/collectSound.wav');
    /** @type {string} Unique instance ID for sound registration. */
    id;

    /**
     * Creates a new CollectibleCoin instance at the given position.
     *
     * @param {number} x - Horizontal position in the game world.
     * @param {number} y - Vertical position in the game world.
     */
    constructor(x, y) {
        super(x, y, 160, 160, 'assets/img/8_coin/coin_1.png');
        this.id = Math.random().toString(36).substr(2, 9);
    }

    /**
     * Registers the coin's pickup sound with the given SoundManager.
     * Uses the instance ID to avoid name collisions between multiple instances.
     *
     * @param {SoundManager} soundManager - The game's central sound manager.
     */
    registerSounds(soundManager) {
        soundManager.register(`coinPickup_${this.id}`, this.pickupSound, VOLUMES.coinCollect, false);
    }
}