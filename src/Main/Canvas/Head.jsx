'use strict';

const React = require('react');

const styles = {
  root: {
    width: '100%',
    position: 'fixed',
    zIndex: 10,
  },
};

const CanvasHeader = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
  },

  mixins: [
    React.addons.PureRenderMixin,
  ],

  render: function() {
    return <div style={styles.root}>
        {this.props.children}
      </div>;
  },
});

module.exports = CanvasHeader;
