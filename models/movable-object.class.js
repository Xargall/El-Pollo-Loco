class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;

  // Load an image from the specified path
  loadImage(path) {
    this.img = new Image(); // Create a new image object
    this.img.src = path; // Set the image source
  }

  moveRight() {
    console.log("move right");
  }

  moveLeft() {}
}
