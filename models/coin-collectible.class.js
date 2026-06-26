class CollectibleCoin extends Collectible {
    pickupSound = new Audio('assets/audio/collectibles/collectSound.wav');

    constructor(x, y) {
        super(x, y, 160, 160, 'assets/img/8_coin/coin_1.png')
        this.pickupSound.volume = 0.4;
    }
}