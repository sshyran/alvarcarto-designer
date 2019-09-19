import Odometer from './Odometer';
import React from 'react';
import { Icon, Badge, Tooltip } from 'antd';
import { calculateCartPrice, getCurrencySymbol } from 'alvarcarto-price-util';
import history from '../history';
import ButtonLink from './ButtonLink';

class PricePanel extends React.Component {
  render() {
    const { cart, additionalCart, promotion } = this.props.globalState;
    const combinedCart = cart.concat(additionalCart);
    const totalPrice = calculateCartPrice(combinedCart, { promotion, ignorePromotionExpiry: true });
    const itemCount = cart.length;

    return (
      <div className="PricePanel">
        <div className="PricePanel__container">
          {
            itemCount > 1
              ? <div className="PricePanel__badge">
                  <Tooltip title={`You have ${itemCount} designs in your order.`}>
                    <Badge count={itemCount} />
                  </Tooltip>
                </div>
              : null
          }

          <h5 className="PricePanel__price">
            <Odometer value={totalPrice.humanValue} />
            <span className="PricePanel__price-currency">{getCurrencySymbol(totalPrice.currency)}</span>
            <span className="PricePanel__price-shipping">+ Free shipping</span>
          </h5>

          <ButtonLink onClick={this._onCheckoutClick} className="PricePanel__checkout-link">
            Checkout
            <Icon type="right" />
          </ButtonLink>
        </div>
      </div>
    );
  }

  _onCheckoutClick = () => {
    history.push('/checkout');
  };
}

export default PricePanel;
