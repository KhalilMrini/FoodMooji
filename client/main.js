import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import React, { Component } from 'react';

import SplitScreen from '../imports/ui/SplitScreen.jsx';

import './main.html';

var from = 0;
var to = 24;
var country = "World"

function init() {
	if (arguments.callee.done) 
    return;

	arguments.callee.done = true;

	if (_timer) clearInterval(_timer);

  build_earth();

  build_slider();
}

function build_earth(){
  var options = {
    sky: true,
    atmosphere: true,
    dragging: true,
    tilting: false,
    zooming: true,
    center: [46.8011, 8.2266],
    zoom: 2
  };
  
  earth = new WE.map('earth_div', options);
  
  WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(earth);

  var bounds = earth.getBounds()

  var boundariesUrl = "https://raw.githubusercontent.com/matej-pavla/Google-Maps-Examples/master/BoundariesExample/geojsons/world.countries.geo.json";

  document.getElementById('backToWorld').disabled = true;

  earth.on('dblclick', function(e) {
    lat = e.latlng.lat
    lon = e.latlng.lng
    var url = "http://maps.googleapis.com/maps/api/geocode/json?language=en&latlng=" + lat + "," + lon + "&sensor=false";
    $.getJSON(url, function (data) {
      country = "World"
      if (data.results && (d = data.results[data.results.length - 1]) && d.address_components[0].types.indexOf ('country') > -1) {
        country = d.address_components[0].long_name
        nelat = d.geometry.bounds.northeast.lat
        nelon = d.geometry.bounds.northeast.lng
        swlat = d.geometry.bounds.southwest.lat
        swlon = d.geometry.bounds.southwest.lng
        document.getElementById('backToWorld').disabled = false;
        earth.panInsideBounds([[nelat, nelon],[swlat, swlon]])
      } else {
         document.getElementById('backToWorld').disabled = true;
         earth.panInsideBounds(bounds)
      }
      render(<SplitScreen id="screen" country={country} from={from} to={to} />, document.getElementById('render-target'));
    });
  });

  var adjustZoom = function(){
    zoom = earth.getZoom()
    if (zoom >= 0 && zoom <= 18){
      $("input[type=range]").val(zoom)
    }
  }

  earth.on('wheel', adjustZoom);

  document.getElementById('opacity2').addEventListener('change', function(e) {
    earth.setZoom(e.target.value);
  });
  
  document.getElementById('backToWorld').addEventListener('click', function() {
    document.getElementById('backToWorld').disabled = true;
    earth.panInsideBounds(bounds);
    country="World"
    render(<SplitScreen id="screen" country={country} from={from} to={to} />, document.getElementById('render-target'));
  });
}

function build_slider(){
  $('input[type="rangeslide"]').ionRangeSlider({
    type: "double",
    min: 0,
    max: 24,
    from: 0,
    to: 24,
    keyboard: true,
    grid: true,
    grid_num: 24,
    min_interval:1,
    grid: true,
    force_edges:true,
    drag_interval:true,
    prettify: function (num) {
      if (num == 0 || num == 24){
        return "Midnight";
      } else if (num == 12){
        return "Noon";
      } else if (num < 12) {
        return num + " am";
      } else {
        return (num - 12) + " pm";
      }
    },
    onFinish: function (data) {
      console.log(data);
      console.log(document.getElementById('screen'))
      from = data.from
      to = data.to
      render(<SplitScreen id="screen" country={country} from={from} to={to} />, document.getElementById('render-target'));
    }
  });
}
      
if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", init, false);
}

/* for Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
  document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
  var script = document.getElementById("__ie_onload");
  script.onreadystatechange = function() {
    if (this.readyState == "complete") {
      init(); // call the onload handler
    }
  };
/*@end @*/

/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
  var _timer = setInterval(function() {
    if (/loaded|complete/.test(document.readyState)) {
      init(); // call the onload handler
    }
  }, 10);
}

/* for other browsers */
window.onload = init;

Meteor.startup(() => {
  render(<SplitScreen id="screen" />, document.getElementById('render-target'));
});