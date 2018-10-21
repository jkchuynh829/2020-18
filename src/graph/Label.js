
export class Label {
  graphicsObject = null;
  animations = [];
  constructor(name, location, text) {
    this.name = name;
    this.location = location;
    this.text = text;
  }

  bindToGraph(label) {
    this.graphicsObject = label;
  }
  animate() {
    this.animations = this.animations
      .filter(animation => animation.step(this.graphicsObject));
  }

  setAnimation(animation) {
    this.animations.push(animation);
  }
}