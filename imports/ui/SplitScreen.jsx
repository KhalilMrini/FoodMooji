import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import { createContainer } from 'react-meteor-data'
import { Meteor } from 'meteor/meteor'
import FreeScrollBar from 'react-free-scrollbar'

function readStringFromFileAtPath(pathOfFileToReadFrom){
  var request = new XMLHttpRequest();
  request.open("GET", pathOfFileToReadFrom, false);
  request.send(null);
  var returnValue = request.responseText;
  return returnValue;
}

function compareNumbers(a, b) {
  var value_a = parseInt(a.split(',')[1])
  var value_b = parseInt(b.split(',')[1])
  return value_b - value_a;
}

function processData() {
  var text = readStringFromFileAtPath("https://raw.githubusercontent.com/KhalilMrini/FoodMooji/master/tweets_data.csv")
  var raw_lines = text.split('\n')
  var headers = raw_lines[0].split(',')
  var object = new Object()
  for (var i = 1; i < raw_lines.length; i++){
    var elements = raw_lines[i].split(',')
    var index = ""
    for (var j = 0; j < elements.length - 1; j++){
      if (j > 0){
        index = index + ","
      }
      index = index + elements[j]
    }
    object[index] = elements[elements.length - 1]
  }
  return object
}

function processCountries() {
  var text = readStringFromFileAtPath("https://raw.githubusercontent.com/KhalilMrini/FoodMooji/master/tweets_country.csv")
  var raw_lines = text.split('\n')
  var headers = raw_lines[0].split(',')
  var object = new Object()
  for (var i = 1; i < raw_lines.length; i++){
    var elements = raw_lines[i].split(',')
    var index = elements[0]
    var value = elements[1] + "," + elements[2]
    if (!object.hasOwnProperty(index)){
      object[index] = []
    }
    object[index].push(value)
  }
  var keys = Object.keys(object)
  for (var i = 0; i < keys.length; i ++){
    object[keys[i]].sort(compareNumbers)
  }
  return object
}

export default class SplitScreen extends Component {

  constructor(props){
    super(props);
    this.state = { tweets_data : processData(), tweets_country : processCountries(), food: "All"};
  }

  handleClick(value) {
    this.setState({food: value.split(',')[0]})
  }

  renderItem(value){
    if (value.split(',')[0] == this.state.food){
      return (
        <li className="span_item_selected" id={value} key={value} onClick={this.handleClick.bind(this, value)}>
          <p id="p_item">{value}</p>
        </li>)
    } else {
      return (
        <li className="span_item" id={value} key={value} onClick={this.handleClick.bind(this, value)}>
          <p id="p_item">{value}</p>
        </li>)
    }
  }

  render() {
  	var divStyle = {
      fontFamily: "Palatino Linotype, Times, serif",
      fontSize: "40px"
    };
    var country = this.props.country ? this.props.country : "World"
    var list = this.state.tweets_country[country]
    var len = list ? list.length : 0
    return (
      <SplitPane split="vertical" defaultSize="33%" className="primary">
        <SplitPane split="horizontal" defaultSize="50%">
          <div>
            <div id="earth_div"></div>
          </div>
          <FreeScrollBar>
            <p>Food list of <b>{country}</b>: {len} items </p>
            { list ? <ul>{list.map((value) => this.renderItem(value))}</ul> : null }
          </FreeScrollBar>
        </SplitPane>
        <SplitPane split="horizontal" defaultSize="15%">
          <div>
            <img src="https://raw.githubusercontent.com/KhalilMrini/FoodMooji/master/images/FoodMooji.png" />
          </div>
          <div>
            <p>Graph for {this.state.food}</p>
          </div>
        </SplitPane>
      </SplitPane>)
  }
}