import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCart,
  updateCartQuantity,
  addToCart,
  updateProducts,
  setLoading,
} from '../components/Store/slice';
import { idbPromise } from '../utils/helpers';
import spinner from '../assets/spinner.gif';
import Cart from '../components/Cart'

function Detail() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.product);

  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({});

  const { products, cart, loading, data } = state;

  useEffect(() => {
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    } else if (data) {
      dispatch(
        updateProducts({
          products: data.products,
        })
      );

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch(
          updateProducts({
            products: indexedProducts,
          })
        );
      });
    }
  }, [products, data, loading, dispatch, id]);

  const addToCartFn = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      dispatch(
        updateCartQuantity({
          _id: id,
          purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
        })
      );
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      dispatch(
        addToCart({
          product: { ...currentProduct, purchaseQuantity: 1 },
        })
      );
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  const removeFromCartFn = () => {
    dispatch(
      removeFromCart({
        _id: currentProduct._id,
      })
    );

    idbPromise('cart', 'delete', { ...currentProduct });
  };

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  return (
    <>
      {currentProduct && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCartFn}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={removeFromCartFn}
            >
              Remove from Cart
            </button>
          </p>
          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {state.loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
