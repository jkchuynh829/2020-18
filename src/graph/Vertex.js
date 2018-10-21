
export class Vertex {
  graphicsObject = null;
  animations = [];
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  bindToGraph(vert) {
    this.graphicsObject = vert;
  }
  animate() {
    this.animations = this.animations
      .filter(animation => animation.step(this.graphicsObject));
  }

  setAnimation(animation) {
    this.animations.push(animation);
  }
}