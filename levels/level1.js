/**
 * Creates and returns Level 1 of the game.
 * Uses the level generator with predefined parameters
 * to populate enemies, collectibles and the endboss.
 *
 * @returns {Level} A fully generated Level 1 instance.
 */

function createLevel1() {
    return generateLevel({
        segments: 4,
        chickenCount: 6,
        babyChickenCount: 4,
        hasEndboss: true,
        bottleCount: 5,
        coinPatternCount: 3,
    });
}