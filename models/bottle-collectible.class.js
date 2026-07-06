/**
 * Represents a collectible salsa bottle in the game world.
 * When picked up by the character, it increases the bottle count.
 *
 * @extends Collectible
 */
class CollectibleBottle extends Collectible {
    /** @type {Audio} Sound played when the bottle is picked up. */
    pickupSound = new Audio('assets/audio/collectibles/bottleCollectSound.wav');
    /** @type {string} Unique instance ID for sound registration. */

    id;

    /**
     * Creates a new CollectibleBottle instance at the given position.
     *
     * @param {number} x - Horizontal position in the game world.
     * @param {number} y - Vertical position in the game world.
     */
    constructor(x, y) {
        super(x, y, 50, 60, 'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.id = Math.random().toString(36).substr(2, 9); // Generate a unique ID for the bottle
    }

    /**
    * Registers the bottle's pickup sound with the given SoundManager.
    * Uses the instance ID to avoid name collisions between multiple instances.
    *
    * @param {SoundManager} soundManager - The game's central sound manager.
    */
    registerSounds(soundManager) {
        soundManager.register(`bottlePickup_${this.id}`, this.pickupSound, VOLUMES.bottleCollect, false);
    }
}