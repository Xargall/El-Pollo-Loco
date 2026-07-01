// ui.manager.js
export class UIManager {
    showGameOverButtons() {
        document.getElementById("restartButton").style.display = "inline-block";
        document.getElementById("mainMenuButton").style.display = "inline-block";
        document.getElementById("nextLevelButton").style.display = "none";
        document.getElementById("endScreenButtons").style.display = "flex";
    }

    showWinButtons() {
        document.getElementById("restartButton").style.display = "none";
        document.getElementById("mainMenuButton").style.display = "inline-block";
        document.getElementById("nextLevelButton").style.display = "inline-block";
        document.getElementById("endScreenButtons").style.display = "flex";
    }
}