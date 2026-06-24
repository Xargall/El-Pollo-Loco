class DrawableObject {
    x = 120;
    y = 280;

    height = 150;
    width = 100;
    img;
    imageCache = [];
    currentImage = 0;

    // Load an image from the specified path
    loadImage(path) {
        this.img = new Image(); // Create a new image object
        this.img.src = path; // Set the image source
    }

    // Load multiple images from an array of paths
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}