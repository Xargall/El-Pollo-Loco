class Collectible extends DrawableObject {
    constructor(x, y, width, height, imagePath){
        super();
        this.x = x,
        this.y = y;
        this.width = width;
        this.height = height;
        this.loadImage(imagePath);

    }
}