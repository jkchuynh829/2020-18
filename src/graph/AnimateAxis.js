export class AnimateAxis {
  stepCount = 0;
  constructor(startX, startY, endX, endY, duration) {
    this.sX = startX;
    this.sY = startY;
    this.eX = endX;
    this.eY = endY;
    this.duration = duration;
  }

  step(graphicsObject) {
    if (this.stepCount <= this.duration) {
      this.animateLine(graphicsObject);
      this.stepCount++;
      return true;
    }
    return false;
  }

  animateLine(graphics) {
    graphics.clear();
    var ratio = (this.duration - this.stepCount) / this.duration;
    var x = (1 - ratio) * this.eX + ratio * this.sX;
    var y = (1 - ratio) * this.eY + ratio * this.sY;
    var coordinates = { x: x, y: y };
    graphics.lineStyle(2, 0xffffff, 1, 0.5);
    graphics.moveTo(this.sX, this.sY);
    graphics.lineTo(coordinates.x, coordinates.y);
  }
}
