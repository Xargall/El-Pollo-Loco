class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;


    constructor() {
        super().loadImage('assets/img/5_background/layers/4_clouds/1.png')
        this.x = 0 + Math.random() * 500; // Random x position between 200 and 700
        this.animate();

    }

    // Animate the cloud's movement to the left
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

}