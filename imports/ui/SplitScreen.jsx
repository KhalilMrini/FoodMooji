import React, { Component } from 'react';
import SplitPane from 'react-split-pane';

export default class SplitScreen extends Component {
  render() {
  	var divStyle = {
      fontFamily: "Palatino Linotype, Times, serif",
      fontSize: "40px"
    };
    return (
      <SplitPane split="vertical" defaultSize="33%" className="primary">
        <SplitPane split="horizontal" defaultSize="50%">
          <div>
            <p>Globe</p>
          </div>
          <div>
            <p>Food list</p>
          </div>
        </SplitPane>
        <SplitPane split="horizontal" defaultSize="10%">
          <div>
            <h1 style={divStyle}>FoodMooji</h1>
          </div>
          <div>
            <p>Graph</p>
          </div>
        </SplitPane>
      </SplitPane>)
  }
}