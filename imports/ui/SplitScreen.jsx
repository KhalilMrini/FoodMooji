import React, { Component } from 'react';
import SplitPane from 'react-split-pane';

export default class SplitScreen extends Component {
  render() {
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
            <p>FoodMooji</p>
          </div>
          <div>
            <p>Graph</p>
          </div>
        </SplitPane>
      </SplitPane>)
  }
}