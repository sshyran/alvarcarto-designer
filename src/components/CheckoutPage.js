import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import history from '../history';
import _ from 'lodash';
import { Row, Col, Icon, Affix, Modal } from 'antd';
import { postOrder } from '../actions';
import config from '../config';
import CheckoutForm from './CheckoutForm';
import Footer from './Footer';
import CheckoutSummary from './CheckoutSummary';
import Spinner from './Spinner';

const CheckoutPage = React.createClass({
  render() {
    return (
      <div className="CheckoutPage">
        <ReactCSSTransitionGroup
            transitionName="popin"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={100}
          >
          {
            this.props.globalState.postingOrder
              ? <div className="CheckoutPage__overlay">
                  <Spinner />
                  <h5>Completing payment ..</h5>
                </div>
              : null
          }
        </ReactCSSTransitionGroup>

        <a onClick={this._onBackClick} className="CheckoutPage__back-link noselect">
          <Icon type="left" />
          Back to design
        </a>

        <div className="CheckoutPage__logo">
          <a href="https://alvarcarto.com">
            <img
              src={`${config.PUBLIC_URL}/assets/logo.svg`}
              alt="Alvar Carto"
            />
          </a>
        </div>

        <div className="CheckoutPage__row">
          <Affix className="CheckoutPage__summary-container" offsetTop={10}>
            <CheckoutSummary globalState={this.props.globalState} />
          </Affix>
          <CheckoutForm onSubmit={this._onFormSubmit} />
        </div>

        <Footer />
      </div>
    );
  },

  _onBackClick() {
    history.push('/');
  },

  _onFormSubmit(form) {
    const order = _.merge({}, form, {
      cart: this.props.globalState.cart,
    });

    this.props.dispatch(postOrder(order))
      .then(() => history.push('/thankyou'))
      .catch(err => {
        if (_.get(err, 'response.status') === 402) {
          const detailedError = _.get(err, 'response.data.messages.0', 'Unexpected error');
          Modal.error({
            title: 'Payment error',
            content: <div>
              <p>
                Order could not be completed, because processing the
                payment failed with reason: <i>{detailedError}</i>.
              </p>
              <p>
                We're sorry for the inconvenience. If the problem persists,
                please contact our support at <a target="_blank" href="mailto:alvarcartohelp@gmail.com"> alvarcartohelp@gmail.com</a>.
              </p>
            </div>
          });
        } else if (_.get(err, 'response.status') === 400) {
          const detailedError = _.get(err, 'response.data.errors.0.messages.0', 'Unexpected error');
          Modal.error({
            title: 'Invalid order details',
            content: <div>
              <p>
                Order could not be completed, because order form contained
                invalid fields. Error message: <i>{detailedError}</i>.
              </p>
              <p>
                We're sorry for the inconvenience. If the problem persists,
                please contact our support at <a target="_blank" href="mailto:alvarcartohelp@gmail.com"> alvarcartohelp@gmail.com</a>.
              </p>
            </div>
          });
        } else {
          Modal.error({
            title: 'Unexpected error',
            content: <div>
              <p>
                Order could not be completed, because of an unexpected error.
                Our engineers will fix the problem as soon as possible.
              </p>
              <p>
                We're sorry for the inconvenience. If the problem persists,
                please contact our support at <a target="_blank" href="mailto:alvarcartohelp@gmail.com"> alvarcartohelp@gmail.com</a>.
              </p>
            </div>
          });
        }
      });
  }
});

export default connect(state => ({ globalState: state }))(CheckoutPage);
