import React from 'react';
import _ from 'lodash';
import { Radio, Tooltip } from 'antd';
import MediaQuery from 'react-responsive';
import { getPosterSize, POSTER_SIZES, POSTER_SIZE_TYPES } from 'alvarcarto-common';
import { calculateUnitPrice, getCurrencySymbol } from 'alvarcarto-price-util';
import Price from './Price';
import CONST from '../constants';

class PosterSizeSelect extends React.Component {
  render() {
    const sizeTypeValue = this._getSelectedSize().type;
    return (
      <div className="PosterSizeSelect">
        <MediaQuery minWidth={CONST.SCREEN_MD}>
          {(matches) => {
            return <div className="PosterSizeSelect__type">
              <Radio.Group onChange={this._onTypeChange} value={sizeTypeValue}>
                {
                  _.map(POSTER_SIZE_TYPES, type => {
                    const radioButton = <Radio.Button key={type.id} value={type.id}>{type.label}</Radio.Button>;
                    if (!matches) {
                      return radioButton;
                    }

                    return <Tooltip key={type.id} title={type.description}>
                      {radioButton}
                    </Tooltip>
                  })
                }
              </Radio.Group>
            </div>
          }}
        </MediaQuery>

        <MediaQuery minWidth={CONST.SCREEN_MD}>
          {(matches) => {
            if (matches) {
              return this._renderRadio();
            } else {
              return this._renderSelect();
            }
          }}
        </MediaQuery>
      </div>
    );
  }

  _renderSelect = () => {
    const sizes = this._getSizesToShow();
    return <div className="pure-css-select-style theme-default">
      <select
        value={this.props.selected}
        onChange={this._onChange}
      >
        {
          _.map(sizes, (item) => {
            const price = calculateUnitPrice(item.id);

            return <option
              value={item.id}
              key={item.id}
            >
              {item.label} ({price.humanValue}{getCurrencySymbol(price.currency)})
            </option>;
          })
        }
      </select>
    </div>;
  };

  _renderRadio = () => {
    const sizes = this._getSizesToShow();
    return <Radio.Group value={this.props.selected} onChange={this._onChange}>
      {
        _.map(sizes, item => {
          const price = calculateUnitPrice(item.id);

          return <Radio
            key={item.id}
            value={item.id}
          >
            {item.label}
            <span className="PosterSizeSelect__price">
              <Price value={price.humanValue} currency={price.currency} />
            </span>
          </Radio>;
        })
      }
    </Radio.Group>;
  };

  _getSelectedSize = () => {
    const { props } = this;
    return getPosterSize(props.selected);
  };

  _getSizesToShow = () => {
    const selectedType = this._getSelectedSize().type
    const sizes = _.filter(POSTER_SIZES, size => size.type === selectedType);
    return sizes;
  };

  _onChange = (e) => {
    this.props.onChange(e.target.value);
  };

  _onTypeChange = (e) => {
    this.props.onTypeChange(e.target.value);
  };
}

export default PosterSizeSelect;

