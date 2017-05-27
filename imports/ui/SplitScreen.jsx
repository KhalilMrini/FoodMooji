import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import { createContainer } from 'react-meteor-data'
import { Meteor } from 'meteor/meteor'
import FreeScrollBar from 'react-free-scrollbar'
import PieChart from './PieChart.js'

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

// When the user clicks on <div>, open the popup
function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

export default class SplitScreen extends Component {

  constructor(props){
    super(props);
    this.state = { tweets_country : processCountries(), food: "All"};
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

  filterList(country, item){
    if (item) {
      if (this.state.tweets_country[country]) {
        return this.state.tweets_country[country].filter((value) => value.startsWith(item))
      } else {
        return null
      }
    } else {
      if (this.state.tweets_country[country]) {
        return this.state.tweets_country[country]
      } else {
        return null
      }
    }
  }

  render() {
    var divStyle = {
      fontFamily: "Palatino Linotype, Times, serif",
      fontSize: "40px"
    };
    var country = this.props.country ? this.props.country : "World"
    var list = this.filterList(country, "")
    var len = list ? list.length : 0
    var from = this.props.from ? this.props.from : 0
    var to = this.props.to ? this.props.to : 24
    return (
      <SplitPane split="vertical" defaultSize="33%" className="primary">
        <SplitPane split="horizontal" defaultSize="50%">
          <div>
            <div id="earth_div"></div>
            <div id="buttons">
              <p className="onMap"><b>{country}</b></p>
              <input type="button" id="backToWorld" value="Go Back to World" />
            </div>
            <div id="layercontrol">
              –<input type="range" id="opacity2" min="0" max="18" step="1" value="2" onChange={function(e){ this.props.value = e.target.value}} />+<br />
            </div>
          </div>
          <SplitPane split="horizontal" defaultSize="15%">
            <div><p>Food tweeted about in <b>{country}</b>: {len} items </p></div>
            <SplitPane split="horizontal" defaultSize="12%">
              <div>
                <input id="myInput" type="text" onChange={function(e) {
                  // Declare variables
                  var input, filter, table, tr, td, i;
                  input = document.getElementById("myInput");
                  filter = input.value.toUpperCase();
                  table = document.getElementById("myList");
                  tr = table.getElementsByTagName("li");
                  // Loop through all table rows, and hide those who don't match the search query
                  for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("p")[0];
                    if (td) {
                      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                      } else {
                        tr[i].style.display = "none";
                      }
                    } 
                  }
                }} placeholder="Search for food..." />
              </div>
              <FreeScrollBar>
                  { list ? <ul id="myList">{list.map((value) => this.renderItem(value))}</ul> : null }
              </FreeScrollBar>
            </SplitPane>
          </SplitPane>
        </SplitPane>
        <SplitPane split="horizontal" defaultSize="15%">
          <div id="title"><img src="https://raw.githubusercontent.com/KhalilMrini/FoodMooji/master/images/FoodMooji.png" /></div>
          <div id="graph_div">
            <div style={{textAlign: "right", width: "90%"}}>
              <div className="popup" onMouseOver={myFunction} onMouseOut={myFunction} style={{
                  textAlign: "right", width: 30, height: 30,
                  backgroundImage: 'url("http://www.inspativity.com/wp-content/uploads/2016/03/i-icon-1-227x300.png")',
                  backgroundRepeat: 'no-repeat', backgroundSize: 20
              }} alt="info">
              <span className="popuptext" id="myPopup">We filter food words as well as emojis
                in Millions of Tweets, and 'translate' emojis into 8-emotion categories. </span>
              </div>
            </div>
            <p>Graph for {this.state.food}</p>
            <PieChart
              width={document.getElementById("render-target").offsetWidth*0.67}
              height="500"
              radius="250"
              country={country}
              food={this.state.food}
              from={from}
              to={to} />
            <SplitPane split="vertical" defaultSize="10%">
              <div></div>
              <SplitPane split="vertical" defaultSize="89%">
                <div id="slider"><input type="rangeslide" /></div>
                <div></div>
              </SplitPane>
            </SplitPane>
          </div>
        </SplitPane>
      </SplitPane>)
  }
}