/**
 * Creates and returns Level 3 of the game.
 * Uses the level generator with predefined parameters
 * to populate enemies, collectibles and the endboss.
 *
 * @returns {Level} A fully generated Level 3 instance.
 */

function createLevel3() {
    return generateLevel({
        segments: 10,
        chickenCount: 15,
        babyChickenCount: 6,
        hasEndboss: false,
        bottleCount: 8,
        coinPatternCount: 7,
    });
}