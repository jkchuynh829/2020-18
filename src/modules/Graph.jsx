import React, { Component } from "react";
import { GraphInstance }  from "../graph/GraphInstance";
import { GraphManager } from "../graph/GraphManager";

export class Graph extends Component {

  theGraph = null;
  manager = null;
  dummyData = [
    {
      "businessName": "Bizznass",
      "principle": 100,
      "loanDuration": 18, //months
      "interestRate": 0.1,
      "startDate": 3453453
    },
        {
      "businessName": "Bizznasty",
      "principle": 25,
      "loanDuration": 36, //months
      "interestRate": 0.1,
      "startDate": 554344534
    },
        {
      "businessName": "Nastibizz",
      "principle": 170,
      "loanDuration": 24, //months
      "interestRate": 0.05,
      "startDate": 885655627
    }
  ];
  updatePixi = (element) => {
    this.theGraph = element;
    if(this.theGraph && this.theGraph.children.length<=0) {
       this.theGraph.appendChild(this.graph.graph.view);
    }
  }

  componentWillMount() {
     this.graph = new GraphInstance(375,200);
     this.manager = new GraphManager(this.graph);
     setTimeout(() => this.manager.showPortfolio(this.dummyData),1500);
  }

  componentDidMount() {
    this.graph.init();
    setTimeout(this.manager.makeGraphOutline, 1000);
  }
  componentWillUnmount() {
    this.graph.dispose();
    this.graph = null;
    this.manager = null;
  }
  render() {
    return (
      <div id="graph" ref={this.updatePixi}/>
    );
  }
}

