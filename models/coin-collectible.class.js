class CollectibleCoin extends Collectible {
    pickupSound = new Audio('assets/audio/collectibles/collectSound.wav');
    id;

    constructor(x, y) {
        super(x, y, 160, 160, 'assets/img/8_coin/coin_1.png')
        this.id = Math.random().toString(36).substr(2, 9); // Generate a unique ID for the coin
    }

    registerSounds(soundManager) {
        soundManager.register(`coinPickup_${this.id}`, this.pickupSound, VOLUMES.coinCollect, false);
    }
}

