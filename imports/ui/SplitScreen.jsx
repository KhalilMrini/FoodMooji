import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import { createContainer } from 'react-meteor-data'
import { Meteor } from 'meteor/meteor'

import { Tweets, getCount } from '../api/tweets'

class SplitScreen extends Component {
  constructor(props){
    super(props);
  }

  render() {
  	var divStyle = {
      fontFamily: "Palatino Linotype, Times, serif",
      fontSize: "40px"
    };
    const count = this.props.tweets
    return (
      <SplitPane split="vertical" defaultSize="33%" className="primary">
        <SplitPane split="horizontal" defaultSize="50%">
          <div>
            <p>Globe {count}</p>
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

export default createContainer(() => ({
	tweets: Tweets.find().count()
}), SplitScreen)