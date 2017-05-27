import React, { Component } from 'react';
import ReactDOM from 'react-dom'

var d3PieChart = {};

d3PieChart.create = function(el, props, country, food, from, to) {
    var viz = d3.select(el)
      .append('svg:svg')
        .attr('class', 'd3')
        .attr('width', props.width)
        .attr('height', props.height)
        .attr('radius', props.radius)
      .append("svg:g")
        .attr("transform", "translate(" + props.width / 2 + "," + props.height / 2 + ")");

    this.update(el, country, food, from, to);
}

d3PieChart.update = function(el, country, food, from, to) {
    this.destroy(el);
    var pie = d3.layout.pie()
        .value(function(d) { return d.values; });

    var color = {"1":"#efef84", "2":"#baef84", "3":"#84ef84", "4":"#84baef",
                 "5":"#8484ef", "6":"#ef84ef", "7":"#ef8484", "8":"#efba84"};

    var radius = d3.select(el).select('svg').attr('radius')

    var path = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

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

      var byEmotion_aggregates = d3.nest()
        .key(function(d) { return d.emotion; })
        .rollup(function(v) { return d3.sum(v, function(d) { return d.sum; }); })
        .entries(byCountry);
        
      var byEmotion_Hour = d3.nest()
        .key(function(d) { return d.emotion; })
        .key(function(d) { return d.hour; })
        .entries(byCountry);  
       
      console.log(byCountry);  
      console.log(byEmotion_aggregates);
      console.log(byEmotion_Hour);
        
 

      var arcs = d3.select(el).select('svg').select('g').selectAll("g.slice")
          .data(pie(byEmotion_aggregates))
          .enter()
        .append("svg:g")
          .attr("class", "slice");

      arcs.append("svg:path")
        .attr("fill", function(d) { return color[d.data.key]; })
        .attr("d", path);

      arcs.append("svg:text")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) +")"; })
        .attr("dy", "0.35em")
        .text(function(d) { return d.value; });
      });
}

d3PieChart.destroy = function (el){
  d3.select(el).select('svg').select('g').selectAll("g.slice").remove();
}

export default class PieChart extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    d3PieChart.create(el, {
      width: this.props.width,
      height: this.props.height,
      radius: this.props.radius
    }, this.props.country, this.props.food, this.props.from, this.props.to);
  }

  componentDidUpdate() {
    var el = ReactDOM.findDOMNode(this);
    d3PieChart.update(el, this.props.country, this.props.food, this.props.from, this.props.to);
  }

  componentWillUnmount(){
    var el = ReactDOM.findDOMNode(this);
    d3PieChart.destroy(el);
  }

  render() {
    return (
      <div className="PieChart"></div>
    );
  }
}
