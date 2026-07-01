// sound.manager.js
export class SoundManager {
    constructor() {
        this.sounds = [];
    }

    addSound(sound) {
        this.sounds.push(sound);
    }

    stopAll() {
        this.sounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}