import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import React, { Component } from 'react';

import SplitScreen from '../imports/ui/SplitScreen.jsx';

import './main.html';

function init() {
	if (arguments.callee.done) return;
	arguments.callee.done = true;
	if (_timer) clearInterval(_timer);
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
        var natural = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
          tileSize: 256,
          tms: true,
          scrollWheelZoom: true
        });
        natural.addTo(earth);

        var toner = WE.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
          attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.',
          opacity: 0.6
        });
        toner.addTo(earth);

        var bounds = earth.getBounds()

        earth.on('dblclick', function(e) {
        	lat = e.latlng.lat
        	lon = e.latlng.lng
            var url = "http://maps.googleapis.com/maps/api/geocode/json?language=en&latlng=" + lat + "," + lon + "&sensor=false";
            $.getJSON(url, function (data) {
            	var country = "World"
                if (data.results && (d = data.results[data.results.length - 1]) && d.address_components[0].types.indexOf ('country') > -1) {
                  country = d.address_components[0].long_name
                	nelat = d.geometry.bounds.northeast.lat
              		nelon = d.geometry.bounds.northeast.lng
              		swlat = d.geometry.bounds.southwest.lat
              		swlon = d.geometry.bounds.southwest.lng
              		earth.panInsideBounds([[nelat, nelon],[swlat, swlon]])
                } else {
                  earth.panInsideBounds(bounds)
                }
  				render(<SplitScreen id="screen" country={country} />, document.getElementById('render-target'));
            });
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
  var country = document.getElementById('render-target').getAttribute("country")
  render(<SplitScreen id="screen" country={country} />, document.getElementById('render-target'));
});