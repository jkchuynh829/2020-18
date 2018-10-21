
export class Edge {
  graphicsObject = null;
  animations = [];

  constructor(id, from, to, value) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.value = value;
  }

  bindToGraph(edge) {
    this.graphicsObject = edge;
  }

  animate() {
    this.animations = this.animations
      .filter(animation => animation.step(this.graphicsObject));
  }

  setAnimation(animation) {
    this.animations.push(animation);
  }

}