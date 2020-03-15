class UIText {
  constructor(text, pos, fontSize, color, recenter = true) {
    this.text = text;
    this.pos = pos;
    this.fontSize = fontSize;
    this.color = color;

    if (recenter) {
      this.pos.x -= this.width / 2;
    }
  }

  get font() {
    return this.fontSize + 'px sans';
  }

  get width() {
    context.font = this.font;
    return context.measureText(this.text).width;
  }

  draw() {
    context.font = this.font;
    context.fillStyle = this.color;
    context.fillText(this.text, this.pos.x, this.pos.y);
  }
}
