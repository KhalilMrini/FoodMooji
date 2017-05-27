import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import d3pie from 'd3pie'

var pie;

var d3PieChart = {};

d3PieChart.create = function(el, props, country, food, from, to) {
  d3.csv("https://raw.githubusercontent.com/KhalilMrini/FoodMooji/master/tweets_data.csv", function(d) {
    d.sum = +d.sum;
    d.hour = +d.hour;
    d.emotion = +d.emotion;
    return d;
  }, function(error, data) {
    if (error) throw error;
    var byCountry = data.filter(function(d) {
      if (d["country"] == country & d["food"] == food & d["hour"] >= from & d["hour"] < to) {
        return d;
      }
    });
    var byEmotion = d3.nest()
      .key(function(d) { return d.emotion; })
      .rollup(function(v) { return d3.sum(v, function(d) { return d.sum; }); })
      .entries(byCountry);
    var labels = ["joy", "trust", "fear", "surprise", "sadness", "disgust", "anger", "anticipation"];
    var colors = ["#efef84", "#baef84", "#84ef84", "#84baef",
                 "#8484ef", "#ef84ef", "#ef8484", "#efba84"];
    pieData = [];
    for (var i = 0; i < byEmotion.length; i++) {
      pieData.push({
        label: labels[i],
        value: byEmotion[i].values,
        color: colors[i],
        caption: byEmotion[i].values + " tweets"
      })
    }
    pie = new d3pie(el, {
      header: {
        title: {
          text: "Distribution of emotion for " + food
        },
        location: "pie-center"
      },
      size: {
        canvasHeight: props.height,
        canvasWidth: props.width,
        pieInnerRadius: "75%",
        pieOuterRadius: "100%"
      },
      "data": {
          "content": pieData
      },
      labels: {
          inner: {
            format: ""
          }
      },
      tooltips: {
        enabled: true,
        type: "placeholder",
        string: "{value} tweets ({percentage}%)",
        styles: {fontSize: 16}
      }
    });
  });
}

d3PieChart.update = function(el, props, country, food, from, to) {
  d3.csv("https://raw.githubusercontent.com/KhalilMrini/FoodMooji/master/tweets_data.csv", function(d) {
    d.sum = +d.sum;
    d.hour = +d.hour;
    d.emotion = +d.emotion;
    return d;
  }, function(error, data) {
    if (error) throw error;
    var byCountry = data.filter(function(d) {
      if (d["country"] == country & d["food"] == food & d["hour"] >= from & d["hour"] < to) {
        return d;
      }
    });
    var byEmotion = d3.nest()
      .key(function(d) { return d.emotion; })
      .rollup(function(v) { return d3.sum(v, function(d) { return d.sum; }); })
      .entries(byCountry);
    var labels = ["joy", "trust", "fear", "surprise", "sadness", "disgust", "anger", "anticipation"];
    var colors = ["#efef84", "#baef84", "#84ef84", "#84baef",
                 "#8484ef", "#ef84ef", "#ef8484", "#efba84"];
    pieData = [];
    for (var i = 0; i < byEmotion.length; i++) {
      pieData.push({
        label: labels[i],
        value: byEmotion[i].values,
        color: colors[i],
        caption: byEmotion[i].values + " tweets"
      })
    }
    pie.updateProp("data.content", pieData);
  });
}

d3PieChart.destroy = function (el){
  d3.select(el).select('svg').remove();
}

export default class PieChart extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    d3PieChart.create(el, {
      width: this.props.width,
      height: this.props.height
    }, this.props.country, this.props.food, this.props.from, this.props.to);
  }

  componentDidUpdate() {
    var el = ReactDOM.findDOMNode(this);
    d3PieChart.update(el, {
      width: this.props.width,
      height: this.props.height
    }, this.props.country, this.props.food, this.props.from, this.props.to);
  }

  componentWillUnmount(){
    var el = ReactDOM.findDOMNode(this);
    d3PieChart.destroy(el);
  }

  render() {
    return (
      <div className="PieChart" id="pieChart"></div>
    );
  }
}
