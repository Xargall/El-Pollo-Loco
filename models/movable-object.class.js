class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = [];
  currentImage = 0;
  speed = 0.15;
  otherDirection = false;

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

  playAnimation(images) {
    let i = this.currentImage % this.IMAGES_WALKING.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    console.log("move right");
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60)
  }
}
