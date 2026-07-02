/**
 * Creates and returns Level 2 of the game.
 * Uses the level generator with predefined parameters
 * to populate enemies, collectibles and the endboss.
 *
 * @returns {Level} A fully generated Level 2 instance.
 */

function createLevel2() {
    return generateLevel({
        segments: 7,
        chickenCount: 10,
        babyChickenCount: 6,
        hasEndboss: true,
        bottleCount: 7,
        coinPatternCount: 5,
    });
}