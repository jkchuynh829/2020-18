export class Animation { //abstract class

  constructor(animationProgram) {
    this.animation = animationProgram;
  }
  step(graphicsObject) {
   return this.animation.step(graphicsObject);
  }
}