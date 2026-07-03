const VOLUMES = {
    backgroundMusic: 0.2,
    characterWalk: 0.3,
    characterJump: 0.3,
    characterSnoring: 0.3,
    characterDamage: 0.4,
    characterDead: 0.4,
    endbossAlert: 1.0,
    endbossDead: 0.4,
    chickenDead: 0.4,
    bottleBreak: 0.4,
};

class SoundManager {
    sounds = {};


    register(name, sound, volume = 1, loop = false) {
        sound.volume = VOLUMES[name] ?? volume;
        sound.loop = loop;
        this.sounds[name] = sound;
    }

    play(name) { this.sounds[name]?.play().catch(() => { }); }

    stop(name) {
        this.sounds[name]?.pause();
        if (this.sounds[name]) this.sounds[name].currentTime = 0;
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    setVolume(name, volume) {
        if (this.sounds[name]) this.sounds[name].volume = volume;
    }

    isPlaying(name) {
        return this.sounds[name] && !this.sounds[name].paused;
    }
}