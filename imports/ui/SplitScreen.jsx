import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import { createContainer } from 'react-meteor-data'
import { Meteor } from 'meteor/meteor'

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
  var lines = [];

  for (var i = 1; i < raw_lines.length; i++) {
    var elements = raw_lines[i].split(',')
    tarr = [];
    for (var j = 0; j < headers.length; j++) {
      tarr.push(headers[j]+":"+elements[j]);
    }
    lines.push(tarr);
  }
  return lines;
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

////////////////////////////////////////////////////////////////////////////////
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal(["#e4e429", "#29e487", "#29e429", "#29e4e4", "#2929e4", "#e42987", "#e42929", "#e48729"]);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.sum; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

function drawPie(data, country, food) {
  var arc = g.selectAll(".arc")
    .data(pie(data.filter(function(d) { return d.country == country; })))
    .enter().append("g")
    .attr("class", "arc");
  console.log(data);

  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.emotion); });

  arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { return d.data.sum; });
}
////////////////////////////////////////////////////////////////////////////////

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
    //var list = this.state.tweets_country[country]
console.log(list);
    var list = this.state.tweets_data;
    var len = list ? list.length : 0
    return (
      <SplitPane split="vertical" defaultSize="33%" className="primary">
        <SplitPane split="horizontal" defaultSize="50%">
          <div>
            <div id="earth_div"></div>
          </div>
          <div>
            <p>Food list of {country}: {len} items </p>
            { list ? 
            <ul className='nav nav-pills'>
              {list.map((value) => (
                <li key={value}>
                  {value}
                </li>
              ))}
            </ul> : null }
          </div>
        </SplitPane>
        <SplitPane split="horizontal" defaultSize="10%">
          <div>
            <h1 style={divStyle}>FoodMooji</h1>
          </div>
          <div>
            <p>Graph</p>
            <p>{drawPie(list, country, "All")}</p>
          </div>
        </SplitPane>
      </SplitPane>)
  }
}
