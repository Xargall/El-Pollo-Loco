class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;
    intervalId;


    constructor() {
        super().loadImage('assets/img/5_background/layers/4_clouds/1.png')
        this.x = 0 + Math.random() * 500;
        this.animate();

    }


    animate() {
        this.intervalId = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

    destroy() {
        clearInterval(this.intervalId);
    }

}