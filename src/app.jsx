'use strict';

const React = require('react/addons');
const injectTapEventPlugin = require('react-tap-event-plugin');
const {Provider} = require('react-redux');

const config = require('config');
const store = require('redux/store');
const API = require('API');
const locale = require('locale');
const Main = require('Main/Main');
const analyticsTraker = require('analyticsTraker');

// API.destroyAll();
API.setUpDataBase();

if (config.platform === 'browser') {
  window.addEventListener('keyup', function(event) {
    if (event.keyCode === 37) { // Left arrow
      document.dispatchEvent(new Event('backbutton'));
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  window.Perf = React.addons.Perf;

  // To run the tests
  window.tests = {
    API: API,
    fixtureBrowser: require('../test/fixtureBrowser'),
    immutable: require('immutable'),
  };
}

analyticsTraker();
injectTapEventPlugin();

locale.load()
  .then(function() {
    React.render(
      <Provider store={store}>
        {function() {
          return <Main />;
        }}
      </Provider>,
      document.getElementById('main'));
  });
