import React from "react";
import { useContext, useEffect, useState } from "react";
import CartContext from "../CartContext";

export const Cart = () => {
  let total = 0;
  const { cart, setCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [priceFetched, toggleFetchedPrice] = useState(false);

  useEffect(() => {
    if (!cart.items) {
      return;
    }

    if (priceFetched) {
      return;
    }

    fetch("https://ecom-rest-apis.herokuapp.com/api/products/cart-items", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ ids: Object.keys(cart.items) }),
    })
      .then((res) => res.json())
      .then((products) => {
        setProducts(products);
        toggleFetchedPrice(true);
      });
  }, [cart, priceFetched]);

  const getQty = (productId) => {
    return cart.items[productId];
  };

  const increament = (productId) => {
    const existingQty = cart.items[productId];
    const _cart = { ...cart };
    _cart.items[productId] = existingQty + 1;
    _cart.totalItems += 1;
    setCart(_cart);
  };

  const decreament = (productId) => {
    const existingQty = cart.items[productId];
    if (existingQty === 1) {
      return;
    }
    const _cart = { ...cart };
    _cart.items[productId] = existingQty - 1;
    _cart.totalItems -= 1;
    setCart(_cart);
  };

  const getSum = (productId, price) => {
    const sum = getQty(productId) * price;
    total += sum;
    return sum;
  };

  const handleDelete = (productId) => {
    const _cart = { ...cart };
    const qty = _cart.items[productId];
    delete _cart.items[productId];
    _cart.totalItems -= qty;
    setCart(_cart);
    const updatedProductList = products.filter(
      (product) => product._id !== productId
    );
    setProducts(updatedProductList);
  };

  const handleOrderNow = () => {
    window.alert("Order Placed Successfully");
    setProducts([]);
    setCart({});
  };

  return products.length ? (
    <div className="container mx-auto lg:w-1/2 w-full pb-24">
      <h1 className="my-12 font-bold">Cart Items</h1>
      <ul>
        {products.map((product) => {
          return (
            <li className="mb-12" key={product._id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img className="h-16" src={product.image} alt="pizza"></img>
                  <span className="font-bold ml-4 w-48">{product.name}</span>
                </div>
                <div>
                  <button
                    onClick={() => {
                      decreament(product._id);
                    }}
                    className="bg-yellow-500 py-2 px-4 rounded-full leading-none"
                  >
                    -
                  </button>
                  <b className="px-4">{getQty(product._id)}</b>
                  <button
                    onClick={() => {
                      increament(product._id);
                    }}
                    className="bg-yellow-500 py-2 px-4 rounded-full leading-none"
                  >
                    +
                  </button>
                </div>
                <span>Rs {getSum(product._id, product.price)}</span>
                <button
                  onClick={() => {
                    handleDelete(product._id);
                  }}
                  className="bg-red-500 py-2 px-4 rounded-full leading-none text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <hr className="my-6"></hr>
      <div className="text-right">
        <b>Grand Total:</b> Rs {total}
      </div>
      <div className="text-right mt-6">
        <button
          onClick={handleOrderNow}
          className="bg-yellow-500 py-2 px-4 rounded-full leading-none"
        >
          Order Now
        </button>
      </div>
    </div>
  ) : (
    <img
      className="mx-auto w-1/2 mt-12"
      src="/images/empty-cart.png"
      alt=""
    ></img>
  );
};
