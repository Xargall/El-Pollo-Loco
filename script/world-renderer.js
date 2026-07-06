function drawWorld(world) {
    world.ctx.translate(world.camera_x, 0);
    addObjectsToMap(world.ctx, world.level.backgroundObjects);
    addObjectsToMap(world.ctx, world.level.bottles);
    addObjectsToMap(world.ctx, world.level.coins);
    addObjectsToMap(world.ctx, world.level.clouds);
    world.ctx.translate(-world.camera_x, 0);
}

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

function drawForeground(world) {
    world.ctx.translate(world.camera_x, 0);
    addToMap(world.ctx, world.character);
    addObjectsToMap(world.ctx, world.throwableObjects);
    addObjectsToMap(world.ctx, world.level.enemies);
    drawDamageTexts(world.ctx, world.damageTexts);
    world.ctx.translate(-world.camera_x, 0);
}