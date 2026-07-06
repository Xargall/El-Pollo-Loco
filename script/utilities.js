/**
 * Draws all objects in the given array onto the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {DrawableObject[]} objects - Array of drawable objects to render.
 */
function addObjectsToMap(ctx, objects) {
    objects.forEach((obj) => {
        addToMap(ctx, obj);
    });
}

/**
 * Draws a single object onto the canvas.
 * Handles horizontal mirroring for objects facing the opposite direction.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {DrawableObject} mo - The object to draw.
 */
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

/**
 * Applies a horizontal canvas flip for the given object.
 * Saves the canvas state and mirrors the x position.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {DrawableObject} mo - The object to flip.
 */
function flipImage(ctx, mo) {
    ctx.save();
    ctx.translate(mo.width, 0);
    ctx.scale(-1, 1);
    mo.x = mo.x * -1;
}

/**
 * Reverses the horizontal flip applied by flipImage.
 * Restores the canvas state and resets the x position.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {DrawableObject} mo - The object to un-flip.
 */
function flipReverse(ctx, mo) {
    mo.x = mo.x * -1;
    ctx.restore();
}

/**
 * Renders all active damage texts onto the canvas in red.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {DamageText[]} damageTexts - Array of damage text instances to render.
 */
function drawDamageTexts(ctx, damageTexts) {
    damageTexts.forEach((dt) => {
        ctx.fillStyle = 'red';
        ctx.font = 'bold 20px Georgia';
        ctx.fillText(dt.text, dt.x, dt.y);
    });
}

/**
 * Calculates a percentage value from a current and maximum amount.
 *
 * @param {number} current - The current value.
 * @param {number} max - The maximum value.
 * @returns {number} The percentage (0–100).
 */
function calculatePercentage(current, max) {
    return (current / max) * 100;
}

/**
 * Renders the win screen: background, dark overlay, and win image.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} camera_x - The current camera offset.
 * @param {HTMLCanvasElement} canvas - The game canvas element.
 * @param {HTMLImageElement} winImage - The win screen image to display.
 * @param {Level} level - The current level, used to draw the background.
 */
function getGameWonState(ctx, camera_x, canvas, winImage, level) {
    ctx.translate(camera_x, 0);
    addObjectsToMap(ctx, level.backgroundObjects);
    ctx.translate(-camera_x, 0);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(winImage, 60, 40, 600, 400);
}

/**
 * Renders the game over screen: background, dark overlay, and game over image.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} camera_x - The current camera offset.
 * @param {HTMLCanvasElement} canvas - The game canvas element.
 * @param {HTMLImageElement} gameOverImage - The game over image to display.
 * @param {Level} level - The current level, used to draw the background.
 */
function getGameOverState(ctx, camera_x, canvas, gameOverImage, level) {
    ctx.translate(camera_x, 0);
    addObjectsToMap(ctx, level.backgroundObjects);
    ctx.translate(-camera_x, 0);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(gameOverImage, 60, 40, 600, 400);
}