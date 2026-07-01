function addObjectsToMap(ctx, objects) {
    objects.forEach((obj) => {
        addToMap(ctx, obj);
    });
}

function addToMap(ctx, mo) {
    if (mo.otherDirection) {
        flipImage(ctx, mo);
    }
    mo.draw(ctx);
    mo.drawHitbox(ctx);

    if (mo.otherDirection) {
        flipReverse(ctx, mo);
    }
}

function flipImage(ctx, mo) {
    ctx.save();
    ctx.translate(mo.width, 0);
    ctx.scale(-1, 1);
    mo.x = mo.x * -1;
}

function flipReverse(ctx, mo) {
    mo.x = mo.x * -1;
    ctx.restore();
}

function drawDamageTexts(ctx, damageTexts) {
    damageTexts.forEach((dt) => {
        ctx.fillStyle = 'red';
        ctx.font = 'bold 20px Georgia';
        ctx.fillText(dt.text, dt.x, dt.y);
    });
}

function calculatePercentage(current, max) {
    return (current / max) * 100;
}