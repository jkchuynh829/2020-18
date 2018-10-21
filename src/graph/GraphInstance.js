
import * as PIXI from "pixi.js";
import { AnimateAxis } from "./AnimateAxis";
import { Edge } from "./Edge";
import { Vertex } from "./Vertex";
import { AnimateBar } from "./AnimateBar";
import { AnimateLabel } from "./AnimateLabel";
import { Label } from "./Label";

export class GraphInstance {
  graphEdges = [];
  graphVertices = [];
  graphLabels = [];
  length = 0;
  width = 0;
  DURATION = 60;
  steps = 0;
  constructor(length, width) {
    this.length = length;
    this.width = width;
    this.graph = new PIXI.WebGLRenderer(length, width, {transparent: true, antialias: true, forceFXAA: true });
	this.graph.view.style.display = "block";
    this.container = new PIXI.Container();
    this.background = new PIXI.Graphics();
    this.linkLayer = new PIXI.Graphics();
    this.nodeLayer = new PIXI.Graphics();
    this.labelLayer = new PIXI.Graphics();
    this.background.addChild(this.nodeLayer);
    this.background.addChild(this.linkLayer);
    // this.background.addChild(this.labelLayer);
    this.interval = null;
  }

  init() {
    var graphEl = document.getElementById("graph");
    graphEl.appendChild(this.graph.view);
    this.interval = setInterval(() => {
      if (this.shouldAnimate()) {
        this.step();
        requestAnimationFrame(() => this.graph.render(this.background));
      }
    },25);
  }

  addEdge(id, from, to, value) {
    this.addEdgeGraphics(new Edge(id, from, to, value));
  }

  addRectangle(barData) {
    this.addRectGraphics(new Vertex(barData.id, barData));
  }

  addLabel(id, location, text) {
    this.addLabelGraphics(new Label(id, location, text));
  }

  addLabelGraphics(label) {
    let container = new PIXI.Graphics();
    let scale = new PIXI.Point(1.25, 1.25);
    let style = new PIXI.TextStyle({
		align: 'center',
		fill: '#FFFFFF',
		fontFamily: 'Arial',
		fontSize: 10,
		padding: 3,
		wordWrap: true,
		breakWords: true
    });
    let text = new PIXI.Text(label.text, style);
    text.anchor = new PIXI.ObservablePoint(null,null,0.5, 0.5);
    text.cacheAsBitmap = true;
    text.scale = scale;
    label.bindToGraph(text);
    this.labelLayer.addChild(container.addChild(text));
    this.graphLabels[label.name] = label;
  }
  addRectGraphics(vertex) {
    let rect = new PIXI.Graphics();
    vertex.bindToGraph(rect);
    this.nodeLayer.addChild(rect);
    this.graphVertices[vertex.name] = vertex;
  }
  addEdgeGraphics(edge) {
    let edgeGraphics = new PIXI.Graphics();
    edge.bindToGraph(edgeGraphics);
    this.linkLayer.addChild(edgeGraphics);
    this.graphEdges[edge.id] = edge;
  }

  addAnimationToObject(id, type, origin) {
    let Ob = null;
    if (type === "axis") {
      Ob = this.graphEdges[id];
      Ob.setAnimation(new AnimateAxis(Ob.from.x,Ob.from.y,Ob.to.x,Ob.to.y,this.DURATION));
    } else if (type === "bar") {
      Ob = this.graphVertices[id];
      Ob.setAnimation(new AnimateBar(Ob.value,this.DURATION, origin));
    } else if (type === "label") {
      Ob = this.graphLabels[id];
      Ob.setAnimation(new AnimateLabel(this.DURATION, {x: this.graphVertices[id].graphicsObject.x, y: this.graphVertices[id].graphicsObject.y}));
    }
  }
  step() {
    if (this.shouldAnimate()) {
      this.graph.clear();
      Object.keys(this.graphEdges).forEach(key => this.graphEdges[key].animate());
      Object.keys(this.graphVertices).forEach(key => this.graphVertices[key].animate());
      // Object.keys(this.graphLabels).forEach(key => this.graphLabels[key].animate());
      this.steps++;
    }
  }

  shouldAnimate() {
    return this.steps <= this.DURATION * 4;
  }

  dispose() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
