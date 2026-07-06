/** @type {number} Width of one complete background segment in pixels. */
const SEGMENT_WIDTH = 719;

/**
 * Predefined coin placement patterns.
 * Each pattern is a function that takes a base X position and returns
 * an array of {x, y} coordinates for individual coins.
 *
 * @type {Object.<string, function(number): Array<{x: number, y: number}>}
 */
const COIN_PATTERNS = {
    arc: (baseX) => [
        { x: baseX, y: 280 },
        { x: baseX + 60, y: 180 },
        { x: baseX + 120, y: 100 },
        { x: baseX + 180, y: 180 },
        { x: baseX + 240, y: 280 },
    ],
    vertical: (baseX) => [
        { x: baseX, y: 280 },
        { x: baseX, y: 180 },
        { x: baseX, y: 80 },
    ],
    line: (baseX) => [
        { x: baseX, y: 200 },
        { x: baseX + 60, y: 200 },
        { x: baseX + 120, y: 200 },
    ],
};

/**
 * Generates a complete Level instance from the given options.
 *
 * @param {Object} [options={}] - Level generation parameters.
 * @param {number} [options.segments=4] - Number of background segments.
 * @param {number} [options.chickenCount=6] - Number of regular chickens.
 * @param {number} [options.babyChickenCount=4] - Number of baby chickens.
 * @param {boolean} [options.hasEndboss=true] - Whether to include an endboss.
 * @param {number} [options.bottleCount=5] - Number of collectible bottles.
 * @param {number} [options.coinPatternCount=3] - Number of coin patterns to place.
 * @returns {Level} A fully populated Level instance.
 */
function generateLevel(options = {}) {
    const {
        segments = 4,
        chickenCount = 6,
        babyChickenCount = 4,
        hasEndboss = true,
        bottleCount = 5,
        coinPatternCount = 3,
    } = options;

    const levelWidth = segments * SEGMENT_WIDTH;

    const enemies = generateEnemies(chickenCount, babyChickenCount, levelWidth, hasEndboss, bottleCount);
    const clouds = generateClouds(segments, levelWidth);
    const backgroundObjects = generateBackgroundObjects(segments);
    const bottles = generateCollectibles(CollectibleBottle, bottleCount, levelWidth);
    const coins = generateCoinPatterns(coinPatternCount, levelWidth);

    const level = new Level(enemies, clouds, backgroundObjects, bottles, coins);
    level.level_end_x = levelWidth - 200;
    return level;
}

/**
 * Generates the parallax background layers for all segments.
 * Alternates between two visual variants per segment.
 *
 * @param {number} segments - Number of background segments.
 * @returns {BackgroundObject[]} Array of background layer objects.
 */
function generateBackgroundObjects(segments) {
    const objects = [];
    for (let segNum = -1; segNum < segments + 1; segNum++) {
        const x = segNum * SEGMENT_WIDTH;
        const variant = (segNum % 2 === 0) ? '1' : '2';
        objects.push(new BackgroundObject('assets/img/5_background/layers/air.png', x));
        objects.push(new BackgroundObject(`assets/img/5_background/layers/3_third_layer/${variant}.png`, x));
        objects.push(new BackgroundObject(`assets/img/5_background/layers/2_second_layer/${variant}.png`, x));
        objects.push(new BackgroundObject(`assets/img/5_background/layers/1_first_layer/${variant}.png`, x));
    }
    return objects;
}

/**
 * Generates all enemies for the level with spaced random positions.
 * Endboss energy scales with the number of bottles in the level.
 *
 * @param {number} chickenCount - Number of regular chickens to spawn.
 * @param {number} babyChickenCount - Number of baby chickens to spawn.
 * @param {number} levelWidth - Total width of the level in pixels.
 * @param {boolean} hasEndboss - Whether to add an endboss at the end.
 * @param {number} bottleCount - Used to scale endboss energy.
 * @returns {MovableObject[]} Array of enemy instances.
 */
function generateEnemies(chickenCount, babyChickenCount, levelWidth, hasEndboss, bottleCount) {
    const enemies = [];
    const totalCount = chickenCount + babyChickenCount;
    const positions = generateSpacedPositions(totalCount, 450, levelWidth - 400, 80);

    for (let i = 0; i < chickenCount && i < positions.length; i++) {
        const chicken = new Chicken();
        chicken.x = positions[i];
        enemies.push(chicken);
    }

    for (let i = chickenCount; i < totalCount && i < positions.length; i++) {
        const babyChicken = new BabyChicken();
        babyChicken.x = positions[i];
        enemies.push(babyChicken);
    }

    if (hasEndboss) {
        const endboss = new Endboss();
        endboss.x = levelWidth - 100;
        endboss.energy = bottleCount * 7.5;
        endboss.maxEnergy = bottleCount * 7.5;
        enemies.push(endboss);
    }

    return enemies;
}

/**
 * Generates clouds with evenly spaced random positions across the level.
 *
 * @param {number} segments - Number of level segments, used to scale cloud count.
 * @param {number} levelWidth - Total width of the level in pixels.
 * @returns {Cloud[]} Array of Cloud instances.
 */
function generateClouds(segments, levelWidth) {
    const cloudCount = Math.max(3, Math.round(segments * 1.5));
    const positions = generateSpacedPositions(cloudCount, 0, levelWidth, 200);

    return positions.map((x) => {
        const cloud = new Cloud();
        cloud.x = x;
        return cloud;
    });
}

/**
 * Generates a set of collectible instances at spaced random positions.
 *
 * @param {Function} ClassRef - The collectible class to instantiate (e.g. CollectibleBottle).
 * @param {number} count - Number of collectibles to generate.
 * @param {number} levelWidth - Total width of the level in pixels.
 * @returns {Collectible[]} Array of collectible instances.
 */
function generateCollectibles(ClassRef, count, levelWidth) {
    const positions = generateSpacedPositions(count, 200, levelWidth - 200, 150);
    return positions.map((x) => new ClassRef(x, 380));
}

/**
 * Generates a set of random X positions with a minimum spacing between each.
 * Falls back gracefully if not enough positions can be placed within the attempt limit.
 *
 * @param {number} count - Number of positions to generate.
 * @param {number} minX - Minimum X boundary.
 * @param {number} maxX - Maximum X boundary.
 * @param {number} minSpacing - Minimum distance between any two positions.
 * @returns {number[]} Sorted array of X positions.
 */
function generateSpacedPositions(count, minX, maxX, minSpacing) {
    const positions = [];
    let attempts = 0;
    while (positions.length < count && attempts < count * 50) {
        const candidate = minX + Math.random() * (maxX - minX);
        const tooClose = positions.some((p) => Math.abs(p - candidate) < minSpacing);
        if (!tooClose) {
            positions.push(candidate);
        }
        attempts++;
    }
    return positions.sort((a, b) => a - b);
}

/**
 * Generates coins arranged in random patterns across the level.
 * Randomly selects from the available COIN_PATTERNS for each placement.
 *
 * @param {number} patternCount - Number of coin patterns to place.
 * @param {number} levelWidth - Total width of the level in pixels.
 * @returns {CollectibleCoin[]} Array of CollectibleCoin instances.
 */
function generateCoinPatterns(patternCount, levelWidth) {
    const patternTypes = Object.keys(COIN_PATTERNS);
    const baseXPositions = generateSpacedPositions(patternCount, 250, levelWidth - 400, 300);

    const coins = [];
    baseXPositions.forEach((baseX) => {
        const type = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        const points = COIN_PATTERNS[type](baseX);
        points.forEach((p) => coins.push(new CollectibleCoin(p.x, p.y)));
    });

    return coins;
}