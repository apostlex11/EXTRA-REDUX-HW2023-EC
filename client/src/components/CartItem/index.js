import React from 'react';

import { removeFromCart, updateCartQuantity } from '../Store/slice';

import { idbPromise } from '../../utils/helpers';

import { useDispatch } from 'react-redux';


const CartItem = ({ item }) => {

  const dispatch = useDispatch();

  const removeFromCartFn = item => {

    dispatch(removeFromCart({ _id: item._id }));
    idbPromise('cart', 'delete', { ...item });
  };

  const onChange = e => {
    const value = e.target.value;
    if (value === '0') {

      dispatch(
        removeFromCart({
          _id: item._id,
        }),
      );
      idbPromise('cart', 'delete', { ...item });
    } else {
      dispatch(
        updateCartQuantity({
          _id: item._id,
          purchaseQuantity: parseInt(value),
        }),
      );
      idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });
    }
  };

  return (
    <div className="flex-row">
      <div>
        <img src={`/images/${item.image}`} alt="" />
      </div>
      <div>
        <div>
          {item.name}, ${item.price}
        </div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCartFn(item)}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;