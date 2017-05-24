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
    this.state = { tweets_data : processData(), tweets_country : processCountries()};
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
            { list ? 
            <ul>
              {list.map((value) => (
                <li key={value}>
                  {value}
                </li>
              ))}
            </ul> : null }
          </FreeScrollBar>
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