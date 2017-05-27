import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { scaleLinear } from 'd3-scale'
import * as d3 from 'd3'

var d3LineChart = {};


d3LineChart.create = function(el, props, country, food) {
    var viz = d3.select(el)
    .append('svg:svg')
        .attr('class', 'd3')
        .attr('width', props.width)
        .attr('height', props.height)
      .append("svg:g")
        .attr("transform", "translate(" + 50 + "," + 70 + ")");
    
    this.update(el, props, country, food);
}

d3LineChart.update = function(el, props, country, food) {
    this.destroy(el);

    var color = {"1":"#efef84", "2":"#baef84", "3":"#84ef84", "4":"#84baef",
                 "5":"#8484ef", "6":"#ef84ef", "7":"#ef8484", "8":"#efba84"};

    var x = d3.scaleLinear().range([0, props.width]),
        y = d3.scaleLinear().range([props.height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.hour); })
        .y(function(d) { return y(d.values.sum); });
    
    
    
    d3.csv("https://raw.githubusercontent.com/KhalilMrini/FoodMooji/master/tweets_data.csv", function(d) {
      d.sum = +d.sum;
      d.hour = +d.hour;
      d.emotion = +d.emotion;
      return d;
    }, function(error, data) {
      if (error) throw error;

      var byCountry = data.filter(function(d) {
        if (d["country"] == country & d["food"] == food) {
          return d;
        }
      });
        
      var byEmotion_Hour = d3.nest()
        .key(function(d) { return d.emotion; })
        .rollup(function(v) { return d3.sum(v, function(d) { return d.sum; }); })
        .key(function(d) { return d.hour; })
        .entries(byCountry);  
       
      console.log(byCountry);  
      console.log(byEmotion_Hour);
        
    x.domain(d3.extent(data, function(d) { return d.hour; }));

    y.domain([
        d3.min(byEmotion_Hour, function(c) { return d3.min(c.values, function(d) { return d.values.sum; }); }),
        d3.max(byEmotion_Hour, function(c) { return d3.max(c.values, function(d) { return d.values.sum; }); })
        ]);

    z.domain(byEmotion_Hour.map(function(c) { return c.key; }));
        
    var g = d3.select(el).select("svg").select("g")
   
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + props.height +")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Nº of Tweets");

    var emo = g.selectAll(".amotion")
        .data(byEmotion_Hour)
        .enter().append("g")
        .attr("class", "emo");

      emo.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values.values.sum); })
          .style("stroke", function(d) { return z(d.key); });

      emo.append("text")
          .datum(function(d) { return {key: d.key, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) { return "translate(" + x(d.values.hour) + "," + y(d.values.sum) + ")"; })
          .attr("x", 3)
          .attr("dy", "0.35em")
          .style("font", "12px sans-serif")
          .text(function(d) { return d.key; });   
        
      });
}

d3LineChart.destroy = function (el){
  d3.select(el).select('svg').select('g').selectAll("g.slice").remove();
}

export default class LineChart extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    d3LineChart.create(el, {
      width: this.props.width,
      height: this.props.height,
      radius: this.props.radius
    }, this.props.country, this.props.food);
  }

  componentDidUpdate() {
    var el = ReactDOM.findDOMNode(this);
    d3LineChart.update(el, this.props.country, this.props.food);
  }

  componentWillUnmount(){
    var el = ReactDOM.findDOMNode(this);
    d3LineChart.destroy(el);
  }

  render() {
    return (
      <div className="LineChart"></div>
    );
  }
}
