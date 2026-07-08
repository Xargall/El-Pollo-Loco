/** @type {HTMLCanvasElement} The game canvas element. */
let canvas;
/** @type {World} The current World instance. */
let world;
/** @type {Keyboard} The global keyboard input state. */
let keyboard = new Keyboard();
/** @type {Function|null} The level creator function for the currently active level. */
let currentLevelCreator = null;
/** @type {Function[]} Ordered list of all level creator functions. */
const LEVELS = [createLevel1, createLevel2, createLevel3];
/** @type {Audio} Background music played on the main menu. */
const menuMusic = new Audio('assets/audio/music/bgm/kf013823-friday-fiesta.wav');
const menuSoundManager = new SoundManager();
menuSoundManager.register('menuMusic', menuMusic, 0.05, true);
const winImage = new Image();
winImage.src = 'assets/img/You won, you lost/You Win A.png';
const gameOverImage = new Image();
gameOverImage.src = 'assets/img/You won, you lost/You lost.png';
let isMuted = localStorage.getItem('isMuted') === 'true';
menuMusic.muted = isMuted;
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('menuMuteIcon').src = isMuted
    ? './assets/icons/sound_off.png'
    : './assets/icons/sound_on.png';
});


// Menu music starts on first user interaction to comply with browser autoplay policy.
document.addEventListener('click', () => {
  if (document.getElementById('startScreen').style.display !== 'none') {
    menuSoundManager.play('menuMusic');
  }
}, { once: true });

/**
 * Initializes and starts the game with the given level.
 * Destroys any existing World instance before creating a new one.
 *
 * @param {Level} selectedLevel - The level instance to load.
 */
function init(selectedLevel) {
  if (world) world.destroy();
  document.getElementById("startScreen").style.display = "none";
  canvas = document.getElementById("canvas");
  canvas.style.display = "block";
  showGameControls();
  world = new World(canvas, keyboard, selectedLevel);
  world.soundManager.setMasterVolume(isMuted);
  document.getElementById('muteIcon').src = isMuted
    ? './assets/icons/sound_off.png'
    : './assets/icons/sound_on.png';
  menuSoundManager.stop('menuMusic');
  world.soundManager.play('backgroundMusic');

}

/**
 * Closes all panels, sets the current level creator, and starts the game.
 *
 * @param {Function} levelCreator - The level creator function to use.
 */
function startGame(levelCreator) {
  menuSoundManager.stop('menuMusic');
  closeAllPanels();
  currentLevelCreator = levelCreator;
  init(levelCreator());
}

/**
 * Hides the start screen and opens the given panel.
 *
 * @param {string} panelId - The ID of the panel element to show.
 */
function openPanel(panelId) {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById(panelId).style.display = "flex";
}

/**
 * Closes the given panel and returns to the start screen.
 *
 * @param {string} panelId - The ID of the panel element to hide.
 */
function closePanel(panelId) {
  document.getElementById(panelId).style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
}

/** Hides all overlay panels. */
function closeAllPanels() {
  document.getElementById("levelSelectPanel").style.display = "none";
  document.getElementById("controlsPanel").style.display = "none";
  document.getElementById("imprintPanel").style.display = "none";
}

/** Restarts the current level from the beginning. */
function restartGame() {
  document.getElementById("endScreenButtons").style.display = "none";
  init(currentLevelCreator());
}

/** Destroys the current World, stops the game, and returns to the main menu. */
function goToMainMenu() {
  if (world) world.destroy();
  hideGameControls();
  document.getElementById("endScreenButtons").style.display = "none";
  canvas.style.display = "none";
  document.getElementById("startScreen").style.display = "block";
  menuSoundManager.play('menuMusic');
  document.getElementById('menuMuteIcon').src = isMuted
    ? './assets/icons/sound_off.png'
    : './assets/icons/sound_on.png';
}

/**
 * Advances to the next level in the LEVELS array.
 * Wraps back to the first level after the last one.
 */
function loadNextLevel() {
  const currentIndex = LEVELS.indexOf(currentLevelCreator);
  const nextIndex = (currentIndex + 1) % LEVELS.length;
  currentLevelCreator = LEVELS[nextIndex];
  document.getElementById("endScreenButtons").style.display = "none";
  init(currentLevelCreator());
}

window.addEventListener('keydown', (event) => {
  if (event.keyCode == 68) keyboard.D = true;
  if (event.keyCode == 39) keyboard.RIGHT = true;
  if (event.keyCode == 37) keyboard.LEFT = true;
  if (event.keyCode == 38) keyboard.UP = true;
  if (event.keyCode == 40) keyboard.DOWN = true;
  if (event.keyCode == 32) keyboard.SPACE = true;
});

window.addEventListener('keyup', (event) => {
  if (event.keyCode == 68) keyboard.D = false;
  if (event.keyCode == 39) keyboard.RIGHT = false;
  if (event.keyCode == 37) keyboard.LEFT = false;
  if (event.keyCode == 38) keyboard.UP = false;
  if (event.keyCode == 40) keyboard.DOWN = false;
  if (event.keyCode == 32) keyboard.SPACE = false;
});

/** Shows the in-game control buttons and touch controls. */
function showGameControls() {
  document.getElementById("gameControls").style.display = "flex";
  document.getElementById('menuMuteButton').style.display = 'none';
  showTouchControls();
}

/** Hides the in-game control buttons and touch controls. */
function hideGameControls() {
  document.getElementById("gameControls").style.display = "none";
  document.getElementById('menuMuteButton').style.display = 'block';
  hideTouchControls();
}

/**
 * Binds touchstart and touchend events to all touch control buttons,
 * mapping each to the corresponding keyboard key.
 */
function initTouchControls() {
  const buttons = [
    { id: 'btn-left', key: 'LEFT' },
    { id: 'btn-right', key: 'RIGHT' },
    { id: 'btn-jump', key: 'SPACE' },
    { id: 'btn-throw', key: 'D' },
  ];

  buttons.forEach(({ id, key }) => {
    const btn = document.getElementById(id);
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      keyboard[key] = true;
    });
    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
  });
}

/** Shows touch controls if the device supports touch input. */
function showTouchControls() {
  if (navigator.maxTouchPoints > 0) {
    document.getElementById('touchControls').classList.add('visible');
    initTouchControls();
  }
}

/** Hides the touch control overlay. */
function hideTouchControls() {
  document.getElementById('touchControls').classList.remove('visible');
}

/** Toggles the visibility of the touch control overlay. */
function toggleTouchControls() {
  const tc = document.getElementById('touchControls');
  tc.classList.toggle('visible');
}

/** Toggles fullscreen mode for the game container. */
function toggleFullscreen() {
  const container = document.querySelector('.game-container');
  if (!document.fullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    }
  } else {
    document.exitFullscreen();
  }
  canvas.focus();
}

/** Toggles mute state for all in-game sounds and updates the mute button icon. */
function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem('isMuted', isMuted);
  world.soundManager.setMasterVolume(isMuted);
  document.getElementById('muteIcon').src = isMuted
    ? './assets/icons/sound_off.png'
    : './assets/icons/sound_on.png';
  document.getElementById('muteButton').setAttribute('aria-pressed', isMuted);
  canvas.focus();
}

/**
 * Toggles the mute state of the main menu background music.
 * Updates the mute button icon to reflect the current state.
 */
function toggleMenuMute() {
  menuMusic.muted = !menuMusic.muted;
  isMuted = menuMusic.muted;
  localStorage.setItem('isMuted', isMuted);
  document.getElementById('menuMuteIcon').src = menuMusic.muted
    ? './assets/icons/sound_off.png'
    : './assets/icons/sound_on.png';
  document.getElementById('menuMuteButton').setAttribute('aria-pressed', menuMuted);
}