let canvas;
let world;
let keyboard = new Keyboard();
let currentLevelCreator = null;

function init(selectedLevel) {
  document.getElementById("startScreen").style.display = "none";
  canvas = document.getElementById("canvas");
  canvas.style.display = "block";
  world = new World(canvas, keyboard, selectedLevel);
  world.backgroundMusic.play().catch(() => { });
}

function startGame(levelCreator) {
  closeAllPanels();
  currentLevelCreator = levelCreator;
  init(levelCreator());
}

function openPanel(panelId) {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById(panelId).style.display = "flex";
}

function closePanel(panelId) {
  document.getElementById(panelId).style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
}

function closeAllPanels() {
  document.getElementById("levelSelectPanel").style.display = "none";
  document.getElementById("controlsPanel").style.display = "none";
  document.getElementById("imprintPanel").style.display = "none";
}

function restartGame() {
  document.getElementById("endScreenButtons").style.display = "none";
  init(currentLevelCreator())
}

function goToMainMenu() {
  document.getElementById("endScreenButtons").style.display = "none";
  canvas.style.display = "none";
  document.getElementById("startScreen").style.display = "block";
}

function loadNextLevel() {
  document.getElementById("endScreenButtons").style.display = "none";
  currentLevelCreator = (currentLevelCreator === createLevel1) ? createLevel2 : createLevel1;
  init(currentLevelCreator());
}

window.addEventListener('keydown', (event) => {
  if (event.keyCode == 68) {
    keyboard.D = true;
  }

  if (event.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (event.keyCode == 38) {
    keyboard.UP = true;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = true;
  }
})

window.addEventListener('keyup', (event) => {
  if (event.keyCode == 68) {
    keyboard.D = false;
  }

  if (event.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (event.keyCode == 38) {
    keyboard.UP = false;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = false;
  }
})

