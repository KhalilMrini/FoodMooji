import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import React, { Component } from 'react';

import SplitScreen from '../imports/ui/SplitScreen.jsx';

import './main.html';

Meteor.startup(() => {
  render(<SplitScreen />, document.getElementById('render-target'));
});