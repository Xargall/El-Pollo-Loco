/**
 * Central volume configuration for all named sounds in the game.
 * Values are applied automatically on registration via SoundManager.register().
 *
 * @type {Object.<string, number>}
 */
const VOLUMES = {
    backgroundMusic: 0.05,
    characterWalk: 0.2,
    characterJump: 0.2,
    characterSnoring: 0.2,
    characterDamage: 0.3,
    characterDead: 0.4,
    endbossAlert: 1.0,
    endbossDead: 0.4,
    chickenDead: 0.4,
    bottleCollect: 0.4,
    coinCollect: 0.1,
    bottleBreak: 0.4,
    gameOver: 0.4,
    gameWon: 0.4,
    oneUp: 0.3,
};

/**
 * Manages all game audio. Sounds are registered by name and can be
 * played, stopped, or muted centrally. Volume is set from the VOLUMES
 * constant on registration.
 */
class SoundManager {
    /** @type {Object.<string, HTMLAudioElement>} Registry of all sounds keyed by name. */
    sounds = {};

    /**
     * Registers a sound under the given name.
     * Volume is resolved from VOLUMES, falling back to the provided default.
     *
     * @param {string} name - Unique identifier for the sound.
     * @param {HTMLAudioElement} sound - The Audio instance to register.
     * @param {number} [volume=1] - Fallback volume if name is not in VOLUMES.
     * @param {boolean} [loop=false] - Whether the sound should loop.
     */
    register(name, sound, volume = 1, loop = false) {
        sound.volume = VOLUMES[name] ?? volume;
        sound.loop = loop;
        this.sounds[name] = sound;
    }

    /**
     * Plays the sound registered under the given name.
     * Silently ignores playback errors (e.g. autoplay policy).
     *
     * @param {string} name - The name of the sound to play.
     */
    play(name) { this.sounds[name]?.play().catch(() => { }); }

    /**
     * Pauses and resets the sound registered under the given name.
     *
     * @param {string} name - The name of the sound to stop.
     */
    stop(name) {
        this.sounds[name]?.pause();
        if (this.sounds[name]) this.sounds[name].currentTime = 0;
    }

    /** Pauses and resets all registered sounds. */
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    /**
     * Sets the volume of a specific registered sound.
     *
     * @param {string} name - The name of the sound.
     * @param {number} volume - The volume level (0.0 to 1.0).
     */
    setVolume(name, volume) {
        if (this.sounds[name]) this.sounds[name].volume = volume;
    }

    /**
     * Returns true if the given sound is currently playing.
     *
     * @param {string} name - The name of the sound to check.
     * @returns {boolean}
     */
    isPlaying(name) {
        return this.sounds[name] && !this.sounds[name].paused;
    }

    /**
     * Mutes or unmutes all registered sounds.
     * Uses the muted property to preserve original volume values.
     *
     * @param {boolean} muted - Whether to mute all sounds.
     */
    setMasterVolume(muted) {
        Object.values(this.sounds).forEach(sound => {
            sound.muted = muted;
        });
    }
}