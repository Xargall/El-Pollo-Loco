/**
 * Shows the game over end screen buttons.
 * Displays restart and main menu buttons, hides the next level button.
 */
function showGameOverButtons() {
    document.getElementById("restartButton").style.display = "inline-block";
    document.getElementById("mainMenuButton").style.display = "inline-block";
    document.getElementById("nextLevelButton").style.display = "none";
    document.getElementById("endScreenButtons").style.display = "flex";
}

/**
 * Shows the win end screen buttons.
 * Hides the restart button and shows the next level button unless
 * the current level is the last in the LEVELS array.
 */
function showWinButtons() {
    const isLastLevel = currentLevelCreator === LEVELS[LEVELS.length - 1];
    document.getElementById("restartButton").style.display = "none";
    document.getElementById("mainMenuButton").style.display = "inline-block";
    document.getElementById("nextLevelButton").style.display = isLastLevel ? "none" : "inline-block";
    document.getElementById("endScreenButtons").style.display = "flex";
}