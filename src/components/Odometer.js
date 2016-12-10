const React = require('react');
const ReactDOM = require('react-dom');
const HubspotOdometer = require('odometer');

import './Odometer.css';

window.odometerOptions = {
  auto: false,
  duration: 1000,
};

const Odometer = React.createClass({
  getInitialState() {
    return { odometer: null };
  },

  componentDidMount() {
    this.state.odometer = new HubspotOdometer({
      el: ReactDOM.findDOMNode(this.refs.container),
      value: this.props.value,
    });
  },

  componentDidUpdate() {
    if (this.state.odometer) {
      this.state.odometer.update(this.props.value);
    }
  },

  render() {
    return <div className="Odometer" ref="container"></div>;
  }
})

module.exports = Odometer;