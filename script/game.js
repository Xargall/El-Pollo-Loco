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
const menuMusic = new Audio('assets/audio/music/bgm/kf013823-friday-fiesta.mp3');
/** @type {SoundManager} Sound manager instance for the main menu music. */
const menuSoundManager = new SoundManager();
menuSoundManager.register('menuMusic', menuMusic, 0.05, true);
/** @type {HTMLImageElement} Preloaded win screen image. */
const winImage = new Image();
winImage.src = 'assets/img/You won, you lost/You Win A.png';
/** @type {HTMLImageElement} Preloaded game over screen image. */
const gameOverImage = new Image();
gameOverImage.src = 'assets/img/You won, you lost/You lost.png';
/** @type {boolean} Whether the game audio is currently muted. Persisted in localStorage. */
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
 * Initializes and starts the game with the given level instance.
 * Shows a loading screen while preloading assets, then creates the World.
 * Destroys any existing World instance before creating a new one.
 *
 * @param {Level} levelInstance - The pre-created level instance to load.
 */
async function init(levelInstance) {
  if (world) world.destroy();
  prepareLoadingScreen();
  await runPreloader(levelInstance);
  startWorld(levelInstance);
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
  if (panelId === 'imprintPanel' && !document.querySelector('.credits-accordion').dataset.init) {
    initCreditsAccordion();
    document.querySelector('.credits-accordion').dataset.init = 'true';
  }
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

/**
 * Destroys the current World, stops the game, and returns to the main menu.
 * Restores the menu music and updates the mute icon state.
 */
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

/**
 * Shows the in-game control buttons, hides menu controls, and activates touch controls.
 */
function showGameControls() {
  document.getElementById("gameControls").style.display = "flex";
  document.getElementById('menuControls').style.display = 'none';
  showTouchControls();
}

/**
 * Hides the in-game control buttons, restores menu controls, and deactivates touch controls.
 */
function hideGameControls() {
  document.getElementById("gameControls").style.display = "none";
  document.getElementById('menuControls').style.display = 'flex';
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

/** Shows touch controls if the primary input device is a coarse pointer (e.g. touchscreen). */

function showTouchControls() {
  if (window.matchMedia('(pointer: coarse)').matches) {
    document.getElementById('touchControls').classList.add('visible');
    initTouchControls();
  }
}

/** Hides the touch control overlay. */
function hideTouchControls() {
  document.getElementById('touchControls').classList.remove('visible');
}

/**
 * Toggles fullscreen mode for the game container.
 * Focuses the canvas after the transition if the game is running.
 */
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
  if (canvas) canvas.focus();
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
 * Persists the mute state in localStorage and updates the mute button icon.
 */
function toggleMenuMute() {
  menuMusic.muted = !menuMusic.muted;
  isMuted = menuMusic.muted;
  localStorage.setItem('isMuted', isMuted);
  document.getElementById('menuMuteIcon').src = isMuted
    ? './assets/icons/sound_off.png'
    : './assets/icons/sound_on.png';
  document.getElementById('menuMuteButton').setAttribute('aria-pressed', isMuted);
}

/**
 * Prepares the loading screen by hiding the start screen,
 * showing the loading overlay, and initializing the canvas.
 */
function prepareLoadingScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("loadingScreen").style.display = "flex";
  document.getElementById("loadingBarFill").style.width = "0%";
  canvas = document.getElementById("canvas");
  showGameControls();
}

/**
 * Runs the asset preloader for the given level instance.
 * Collects all image paths from game objects and preloads them,
 * updating the loading bar. Waits 300ms after completion so the
 * full bar is briefly visible before the game starts.
 *
 * @param {Level} levelInstance - The level whose assets should be preloaded.
 */
async function runPreloader(levelInstance) {
  const fill = document.getElementById("loadingBarFill");
  const sources = buildPreloadSources(levelInstance);
  const paths = collectImagePaths(sources);
  await preloadImages(paths, fill);
  await new Promise(r => setTimeout(r, 300));
}

/**
 * Builds the list of objects whose IMAGES_* arrays should be preloaded.
 * Uses Character.prototype to collect image paths without triggering
 * the constructor or animation loops.
 *
 * @param {Level} levelInstance - The current level instance.
 * @returns {Object[]} Array of objects with IMAGES_* properties.
 */
function buildPreloadSources(levelInstance) {
  return [
    Character.prototype,
    ...levelInstance.enemies,
    new Statusbar(),
    new BottleStatusbar(),
    new CoinStatusbar(),
    new EndbossStatusbar(),
  ];
}

/**
 * Finalizes the loading sequence and creates the World instance.
 * Shows the canvas, hides the loading screen, starts background music,
 * and stops the menu music.
 *
 * @param {Level} levelInstance - The level instance to pass to the World.
 */
function startWorld(levelInstance) {
  canvas.style.display = "block";
  document.getElementById("loadingScreen").style.display = "none";
  world = new World(canvas, keyboard, levelInstance);
  world.backgroundMusic.play().catch(() => { });
  menuMusic.pause();
  menuMusic.currentTime = 0;
}

/**
 * Animates the credits accordion open and closed.
 * Intercepts the native details toggle to control height manually.
 */
function initCreditsAccordion() {
  const details = document.querySelector('.credits-accordion');
  if (!details) return;
  const body = details.querySelector('.credits-body');
  const summary = details.querySelector('summary');

  summary.addEventListener('click', (e) => {
    e.preventDefault();

    if (details.open) {
      closeAccordion(details, body);
    } else {
      openAccordion(details, body);
    }
  });
}

/**
 * Opens the accordion by animating height from 0 to scrollHeight.
 *
 * @param {HTMLDetailsElement} details
 * @param {HTMLElement} body
 */
function openAccordion(details, body) {
  details.open = true;
  const targetHeight = body.scrollHeight;
  body.style.height = '0px';
  requestAnimationFrame(() => {
    body.style.height = targetHeight + 'px';
  });
}

/**
 * Closes the accordion by animating height back to 0.
 * Removes the open attribute after the transition ends.
 *
 * @param {HTMLDetailsElement} details
 * @param {HTMLElement} body
 */
function closeAccordion(details, body) {
  body.style.height = body.scrollHeight + 'px';
  requestAnimationFrame(() => {
    body.style.height = '0px';
  });
  setTimeout(() => {
    details.open = false;
  }, 300);
}