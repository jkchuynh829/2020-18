import { GraphDataConverter } from "./GraphDataConverter";

export class GraphManager {
  graph = null
  dataConverter = null;
  originY;
  originX;
  endPointXX;
  endPointXY;
  endPointYX;
  endPointYY;
  bars = [];
  spacing = 1;
  interval = 1;


  timespan = 0;
  startEndDates = null;
  constructor(graph) {
    this.graph = graph;
    this.originY = this.graph.width - (this.graph.width/10);
    this.originX = 10 ;
    this.endPointXX = this.graph.length - 10;//- (this.graph.length/20);
    this.endPointXY = this.graph.width - (this.graph.width/10);
    this.endPointYX =this.originX;
    this.endPointYY = 0 + (this.graph.width/10);
  }

  makeGraphOutline = (xAxisLabel, yAxisLabel, xMin, xMax, yMin, yMax) => {
    this.makeXAxis();
    this.makeYAxis();
  }

  makeXAxis() {
      this.graph.addEdge("xAxis", {x: this.originX, y: this.originY}, 
      {x: this.endPointXX, y: this.endPointXY}, null);
    this.graph.addAnimationToObject("xAxis", "axis");
  }

  makeYAxis() {
    this.graph.addEdge("yAxis", {x: this.originX, y: this.originY}, 
      {x: this.endPointYX, y: this.endPointYY}, null);
    this.graph.addAnimationToObject("yAxis", "axis");
  }
  
  showPortfolio(data) {
    this.dataConverter = new GraphDataConverter(data);
    this.startEndDates = this.dataConverter.getTimeFrame();
    this.timespan = this.dataConverter.getDuration();
    this.spacing = Math.floor(this.timespan / 12);
    let count = 1;
    while (count <= this.timespan) {
      let date = new Date(this.startEndDates.startDate.getTime());
      date.setMonth(date.getMonth() + count);
      let val = this.dataConverter.
      getPortfolioValueAtGivenDate(date.getTime());
      this.bars.push({"date" : date, "value" : val, "id": count});
      count++;
    }
  this.bars.forEach((bar,ind) => {!(ind % this.spacing) ? setTimeout(this.makeBarAndLabel,this.getInterval() * 50, bar) : this.makeBar(null)});

  }

  getInterval() {
    return this.interval++;
  }

  makeBarAndLabel = (barData) => {
    this.makeBar(barData);
    this.makeLabel(barData);
  }

  makeBar = (barData) => {
    if (!barData) return;
    this.graph.addRectangle(barData);
    this.graph.addAnimationToObject(barData.id, "bar", this.getOrigin());
  }

  makeLabel = (barData) => {
    if (!barData) return;
    this.graph.addLabel(barData.id, null, barData.date);
    this.graph.addAnimationToObject(barData.id, "label", this.getOrigin());
  }

  getOrigin() {
    return {x:this.originX, y:this.originY}
  }

}