const SEGMENT_WIDTH = 719; // Width for a one complete background segment

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

function generateBackgroundObjects(segments) {
    const objects = [];
    // Start bei -1, damit beim Levelstart links kein Loch im Hintergrund entsteht
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

function generateEnemies(chickenCount, babyChickenCount, levelWidth, hasEndboss, bottleCount) {
    const enemies = [];
    const totalCount = chickenCount + babyChickenCount;
    const positions = generateSpacedPositions(totalCount, 250, levelWidth - 400, 120);

    for (let i = 0; i < chickenCount; i++) {
        const chicken = new Chicken();
        chicken.x = positions[i];
        enemies.push(chicken);
    }

    for (let i = chickenCount; i < totalCount; i++) {
        const babyChicken = new BabyChicken();
        babyChicken.x = positions[i];
        enemies.push(babyChicken);
    }

    if (hasEndboss) {
        const endboss = new Endboss();
        endboss.x = levelWidth - 150;
        endboss.energy = bottleCount * 7.5;
        endboss.maxEnergy = bottleCount * 7.5;
        enemies.push(endboss);
    }

    return enemies;
}

function generateClouds(segments, levelWidth) {
    const cloudCount = Math.max(3, Math.round(segments * 1.5));
    const positions = generateSpacedPositions(cloudCount, 0, levelWidth, 200);

    return positions.map((x) => {
        const cloud = new Cloud();
        cloud.x = x; // überschreibt die zufällige Startposition aus dem Constructor
        return cloud;
    });
}

function generateCollectibles(ClassRef, count, levelWidth) {
    const positions = generateSpacedPositions(count, 200, levelWidth - 200, 150);
    return positions.map((x) => new ClassRef(x, 380));
}

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