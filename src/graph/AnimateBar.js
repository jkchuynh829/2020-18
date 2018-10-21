export class AnimateBar {
  stepCount = 0;
	rectWidth = 20;
	colors = [0x34564, 0xFFFFF, 0x57222];
	constructor(data, duration, graphOrigin) {
		this.data = data;
		this.duration = duration;
		this.graphOrigin = graphOrigin;

	}

	step(graphicsObject) {
		if (this.stepCount <= this.duration) {
			this.animateBar(graphicsObject);
			this.stepCount++;
			return true;
		}
		return false;
	}

	animateBar(graphics) {
      graphics.clear();
	  let ratio =  ((this.duration - this.stepCount)/this.duration);
	  let lastMax = 0;
	  this.data.value.forEach((val,ind) => {
		var y = ((1 - ratio) * val/2) + (ratio * 0);
			graphics.beginFill(this.colors[ind]);
			graphics.drawRect((this.graphOrigin.x + this.data.id * 10 + 20) - this.rectWidth/2, 
		lastMax + this.graphOrigin.y  ,this.rectWidth, -1 * y );
		lastMax += -y;
		});
	}
}