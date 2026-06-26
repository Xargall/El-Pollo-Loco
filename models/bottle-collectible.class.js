class CollectibleBottle extends Collectible {
    pickupSound = new Audio('assets/audio/collectibles/bottleCollectSound.wav');

    constructor(x, y) {
        super(x, y, 50, 60, 'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png')
        this.pickupSound.volume = 0.4;
    }
}