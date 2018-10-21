export class AnimateLabel {
  stepCount = 0;
	rectWidth = 20;
	colors = [0x34564, 0xFFFFF, 0x57222];
	constructor(duration, barOrigin) {
		this.duration = duration;
		this.barOrigin = barOrigin;

	}

	step(graphicsObject) {
		if (this.stepCount <= this.duration) {
			this.animateLabel(graphicsObject);
			this.stepCount++;
			return true;
		}
		return false;
	}

	animateLabel(graphics) {
      //graphics.clear();
	  let ratio =  ((this.duration - this.stepCount)/this.duration);
	  var a = ((1 - ratio) * 1) + (ratio * 0);
		graphics.position.x = this.barOrigin.x;
		graphics.position.y = this.barOrigin.y;
		graphics.alpha = a;
		graphics.rotation = 4;
	}
}