/**
 * Renders the scrolling world layer: background, collectibles, and clouds.
 * Applies and removes the camera offset around all draw calls.
 *
 * @param {World} world - The current World instance.
 */
function drawWorld(world) {
    world.ctx.translate(world.camera_x, 0);
    addObjectsToMap(world.ctx, world.level.backgroundObjects);
    addObjectsToMap(world.ctx, world.level.bottles);
    addObjectsToMap(world.ctx, world.level.coins);
    addObjectsToMap(world.ctx, world.level.clouds);
    world.ctx.translate(-world.camera_x, 0);
}

/**
 * Renders the HUD: health bar, bottle bar, coin bar, extra life counter,
 * endboss health bar (when active), and the level banner on level start.
 * All HUD elements are drawn in screen space, without camera offset.
 *
 * @param {World} world - The current World instance.
 */
function drawHUD(world) {
    addToMap(world.ctx, world.statusBar);
    world.ctx.drawImage(world.pepeIcon, 250, 10, 40, 40);
    world.ctx.fillStyle = "white";
    world.ctx.font = 'bold 20px Georgia';
    world.ctx.fillText(`x ${world.extraLives}`, 295, 45);
    addToMap(world.ctx, world.bottleStatusBar);
    addToMap(world.ctx, world.coinStatusBar);

    const endboss = world.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss && endboss.hasNoticed) {
        addToMap(world.ctx, world.bossStatusBar);
    }

    const elapsed = (new Date().getTime() - world.levelBannerStart) / 1000;
    if (elapsed < 3) drawLevelBanner(world, elapsed);
}

/**
 * Renders the foreground layer: character, thrown bottles, enemies, and damage texts.
 * Applies and removes the camera offset around all draw calls.
 *
 * @param {World} world - The current World instance.
 */
function drawForeground(world) {
    world.ctx.translate(world.camera_x, 0);
    addToMap(world.ctx, world.character);
    addObjectsToMap(world.ctx, world.throwableObjects);
    addObjectsToMap(world.ctx, world.level.enemies);
    drawDamageTexts(world.ctx, world.damageTexts);
    world.ctx.translate(-world.camera_x, 0);
}

/**
 * Draws the western-style poster frame for the level banner.
 * Renders the background fill, double border, and corner ornaments.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} x - Left edge of the banner in canvas coordinates.
 * @param {number} y - Top edge of the banner in canvas coordinates.
 * @param {number} w - Width of the banner in pixels.
 * @param {number} h - Height of the banner in pixels.
 */
function drawBannerFrame(ctx, x, y, w, h) {
    ctx.fillStyle = '#c8a86b';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 6, y + 6, w - 12, h - 12);
    ctx.fillStyle = '#6b4f00';
    ctx.font = '10px Georgia, serif';
    ctx.textAlign = 'center';
    [[x + 10, y + 16], [x + w - 10, y + 16],
    [x + 10, y + h - 5], [x + w - 10, y + h - 5]
    ].forEach(([ox, oy]) => ctx.fillText('✦', ox, oy));
}

/**
 * Draws the text content of the level banner.
 * Renders the "WANTED" subtitle and the level number label.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} cx - Horizontal center of the banner in canvas coordinates.
 * @param {number} cy - Vertical center of the banner in canvas coordinates.
 * @param {number} levelNumber - The current level number to display.
 */
function drawBannerText(ctx, cx, cy, levelNumber) {
    ctx.fillStyle = '#4a2c00';
    ctx.font = 'bold 9px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('— WANTED —', cx, cy - 6);
    ctx.fillStyle = '#2a1500';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.fillText(`LEVEL ${levelNumber}`, cx, cy + 16);
}

/**
 * Renders the animated level banner at the start of each level.
 * Fades out during the last second of its 3-second display window.
 * Also renders the level objective below the banner with the same fade.
 *
 * @param {World} world - The current World instance.
 * @param {number} elapsed - Seconds elapsed since the level started.
 */
function drawLevelBanner(world, elapsed) {
    const alpha = elapsed > 2 ? 1 - (elapsed - 2) : 1;
    const cx = 360, cy = 190, w = 180, h = 60;
    const hasEndboss = world.level.enemies.some(e => e instanceof Endboss);
    const objective = hasEndboss ? 'Defeat the Boss Chicken!' : 'Defeat all Chickens!';
    world.ctx.save();
    world.ctx.globalAlpha = alpha;
    drawBannerFrame(world.ctx, cx - w / 2, cy - h / 2, w, h);
    drawBannerText(world.ctx, cx, cy, world.levelNumber);
    world.ctx.fillStyle = '#2a1500';
    world.ctx.font = 'bold 16px Georgia, serif';
    world.ctx.textAlign = 'center';
    world.ctx.fillText(objective, cx, cy + h / 2 + 25);
    world.ctx.restore();
}