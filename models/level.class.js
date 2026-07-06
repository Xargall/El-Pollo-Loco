/**
 * Represents a game level and holds all its objects.
 * Created by the level generator and passed to the World on initialization.
 */
class Level {
    /** @type {MovableObject[]} All enemy instances in the level. */
    enemies;
    /** @type {Cloud[]} All cloud instances in the level. */
    clouds;
    /** @type {BackgroundObject[]} All background layer objects in the level. */
    backgroundObjects;
    /** @type {CollectibleBottle[]} All collectible bottles in the level. */
    bottles;
    /** @type {CollectibleCoin[]} All collectible coins in the level. */
    coins;
    /** @type {number} Horizontal position of the level end, used to cap character movement. */
    level_end_x = 2200;

    /**
     * Creates a new Level instance with the given game objects.
     *
     * @param {MovableObject[]} enemies - Array of enemy instances.
     * @param {Cloud[]} clouds - Array of cloud instances.
     * @param {BackgroundObject[]} backgroundObjects - Array of background layer objects.
     * @param {CollectibleBottle[]} [bottles=[]] - Array of collectible bottle instances.
     * @param {CollectibleCoin[]} [coins=[]] - Array of collectible coin instances.
     */
    constructor(enemies, clouds, backgroundObjects, bottles = [], coins = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
        this.coins = coins;
    }
}