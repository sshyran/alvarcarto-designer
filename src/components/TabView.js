import React from 'react';
import { Icon } from 'antd';

const TabView = React.createClass({
  getDefaultProps() {
    return { alwaysOpen: false };
  },

  getInitialState() {
    return {
      selected: this.props.initialSelected,
    };
  },

  render() {
    const panelButtons = this.props.children.map(this._createPanelButton);
    const panels = this.props.children.map(this._createPanel);

    return (
      <div className="TabView">
        <div className="TabView__panel-select">
          {panelButtons}
        </div>

        <div className="TabView__panels">
          {panels}
        </div>
      </div>
    );
  },

  _onSelect(index) {
    const alreadySelected = this.state.selected === index;
    if (!alreadySelected || this.props.alwaysOpen) {
      this.setState({ selected: index });
    } else {
      this.setState({ selected: null });
    }
  },

  _onClose(index) {
    this.setState({ selected: null });
  },

  _createPanel(child, index) {
    return React.cloneElement(child, {
      key: index,
      index: index,
      selected: index === this.state.selected,
      onClose: this._onClose,
    });
  },

  _createPanelButton(child, index) {
    return <PanelSelectButton
      key={index}
      index={index}
      header={child.props.header}
      selected={index === this.state.selected}
      onSelect={this._onSelect}
    />;
  },
});

TabView.Panel = React.createClass({
  render() {
    let className = 'TabView__panel';
    if (this.props.selected) {
      className += ' TabView__panel--selected'
    }
    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    return (
      <div className={className}>
        <div className="TabView__panel-close-container">
          <a onClick={this._onClose}>
            <Icon className="bounce" type="down" />
          </a>
        </div>
        <div className="TabView__panel-content">
          {this.props.children}
        </div>
      </div>
    );
  },

  _onClose() {
    this.props.onClose(this.props.index);
  }
});

const PanelSelectButton = React.createClass({
  render() {
    let className = 'TabView__panel-select-button';
    if (this.props.selected) {
      className += ' TabView__panel-select-button--selected'
    }
    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    return (
      <div className={className}>
        <a onClick={this._onSelect}>
          {this.props.header}
        </a>
      </div>
    );
  },

  _onSelect() {
    this.props.onSelect(this.props.index);
  }
});

export default TabView;
