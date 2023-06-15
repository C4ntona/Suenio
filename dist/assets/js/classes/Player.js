class Player {
  constructor({ x, y, width, height, src }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = src;
  }

  draw() {
    // Dibuja la imagen en el lienzo
    c.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
