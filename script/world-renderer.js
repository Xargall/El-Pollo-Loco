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
    if (elapsed < 3) {
        const alpha = elapsed > 2 ? 1 - (elapsed - 2) : 1;
        world.ctx.save();
        world.ctx.globalAlpha = alpha;
        world.ctx.fillStyle = 'black';
        world.ctx.font = 'bold 48px zabars';
        world.ctx.textAlign = 'center';
        world.ctx.fillText(`Level ${world.levelNumber}`, 360, 180);
        world.ctx.restore();
    }
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