import React from 'react';
import _ from 'lodash';
import { setMapView, setMapStyle, setPosterLayout, setMapLabels } from '../actions';
import { coordToPrettyText } from '../util';
import { Icon, Row, Col } from 'antd';
import Accordion from './Accordion';
import TabView from './TabView';
import MediaQuery from 'react-responsive';
import geodist from 'geodist';
import GeoSearch from './GeoSearch';
import PosterSizeSelect from './PosterSizeSelect';
import OrientationSelect from './OrientationSelect';
import PosterLabelInputs from './PosterLabelInputs';
import MapStyleSelect from './MapStyleSelect';
import CONST from '../constants';
import Alert from './Alert';

const formColLabel = { span: 5, md: { span: 6 }, lg: { span: 6 } };
const formColInput = { span: 19, md: { span: 18 }, lg: { span: 18 } };

const AlvarMapDesignPanel = React.createClass({
  render() {
    const { globalState } = this.props;
    const mapItem = globalState.cart[globalState.editCartItem];

    return (
      <div className={`AlvarMapDesignPanel ${this.props.className}`}>
        <MediaQuery maxWidth={CONST.SCREEN_SM}>
          {(matches) => {
            if (matches) {
              return this._renderNarrowView(mapItem);
            } else {
              return this._renderWideView(mapItem);
            }
          }}
        </MediaQuery>

        {/*
        <div className="AlvarMapDesignPanel__recommend">
          <h3>Try one of our picks</h3>
          <CityButtonList onButtonClick={this._onCityButtonClick} />
        </div>
        */}
      </div>
    );
  },

  _renderNarrowView(mapItem) {
    return <div className="AlvarMapDesignPanel__narrow">
      <div className="AlvarMapDesignPanel__narrow-spacer"></div>
      <TabView initialSelected={0}>
        <TabView.Panel className="AlvarMapDesignPanel__location-section" header="Basics">
          {this._renderLocationAndSizePanel(mapItem)}
        </TabView.Panel>
        <TabView.Panel header="Labels">
          {this._renderLabelsPanel(mapItem)}
        </TabView.Panel>
      </TabView>
    </div>;
  },

  _renderWideView(mapItem) {
    return <div className="AlvarMapDesignPanel__wide">
      <Accordion initialSelected={0}>
        <Accordion.Section className="AlvarMapDesignPanel__location-section" header="Location &amp; Size">
          {this._renderLocationAndSizePanel(mapItem)}
        </Accordion.Section>
        <Accordion.Section header="Labels">
          {this._renderLabelsPanel(mapItem)}
        </Accordion.Section>
      </Accordion>
    </div>;
  },

  _renderLocationAndSizePanel(mapItem) {
    return <div className="AlvarMapDesignPanel__group">
      <Row className="ant-form-item">
        <Col {...formColLabel} className="ant-form-item-label">
          <label>Location</label>
        </Col>
        <Col {...formColInput}>
          <GeoSearch onChange={this._onGeoSearch} />
        </Col>
      </Row>

      <Row className="ant-form-item">
        <Col {...formColLabel} className="ant-form-item-label">
          <label>Size</label>
        </Col>
        <Col {...formColInput}>
          <PosterSizeSelect
            orientation={mapItem.orientation}
            selected={mapItem.size}
            onChange={this._onSizeChange}
          />
        </Col>
      </Row>

      <Row className="ant-form-item AlvarMapDesignPanel__orientation-select">
        <Col {...formColLabel} className="ant-form-item-label">
          <label>Layout</label>
        </Col>
        <Col {...formColInput}>
          <OrientationSelect selected={mapItem.orientation} onChange={this._onOrientationChange} />
        </Col>
      </Row>

      <div className="AlvarMapDesignPanel__info">
        <Alert>
          <Icon type="picture" />
          <p>Our posters fit to standard frames which you can find anywhere.</p>
        </Alert>
      </div>

      {/*
      <div className="AlvarMapDesignPanel__group">
        <MapStyleSelect
          selected={mapItem.mapStyle}
          onChange={this._onStyleChange}
        />
      </div>
      */}
    </div>;
  },

  _renderLabelsPanel(mapItem) {
    return <div className="AlvarMapDesignPanel__group">
      <PosterLabelInputs dispatch={this.props.dispatch} labels={{
        enabled: mapItem.labelsEnabled,
        header: mapItem.labelHeader,
        smallHeader: mapItem.labelSmallHeader,
        text: mapItem.labelText,
      }} />
    </div>;
  },

  _onGeoSearch(result) {
    const zoom = boundsToZoom(result.geometry.bounds);
    const lat = result.geometry.location.lat;
    const lng = result.geometry.location.lng;

    this.props.dispatch(setMapView({
      center: {
        lat: lat,
        lng: lng,
      },
      zoom: zoom,
    }));

    this.props.dispatch(setMapLabels({
      header: result.city,
      smallHeader: result.country,
      text: coordToPrettyText({ lat, lng }),
    }));
  },

  _onCityButtonClick(item) {
    this.props.dispatch(setMapView({
      center: { lat: item.lat, lng: item.lng },
      zoom: item.zoom
    }));

    this.props.dispatch(setMapLabels({
      header: item.header,
      smallHeader: item.smallHeader,
      text: coordToPrettyText({ lat: item.lat, lng: item.lng }),
    }));
  },

  _onStyleChange(value) {
    this.props.dispatch(setMapStyle(value));
  },

  _onOrientationChange(value) {
    this.props.dispatch(setPosterLayout({
      orientation: value,
    }));
  },

  _onSizeChange(value) {
    this.props.dispatch(setPosterLayout({
      size: value,
    }));
  },
});

function boundsToZoom(bounds) {
  const point1 = bounds.northeast;
  const point2 = bounds.southwest;
  const dist = geodist(
    { lat: point1.lat, lon: point1.lng },
    { lat: point2.lat, lon: point2.lng },
    { exact: true, unit: 'km' }
  );

  if (dist < 100) {
    return 10;
  } else if (dist < 200) {
    return 8;
  } else if (dist < 300) {
    return 7;
  } else if (dist < 500) {
    return 6;
  } else if (dist < 1000) {
    return 5;
  } else if (dist < 2000) {
    return 3.5;
  } else if (dist < 3000) {
    return 3;
  } else {
    return 2;
  }
}

export default AlvarMapDesignPanel;
