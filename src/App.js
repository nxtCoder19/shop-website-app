import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Cart } from "./pages/Cart";
import { Home } from "./pages/Home";
import { ProductsPage } from "./pages/ProductsPage";
import { SingleProduct } from "./pages/SingleProduct";
import CartContext from "./CartContext";
import { useState, useEffect } from "react";
import { getCart, storeCart } from "./helpers";

export const App = () => {
  const [cart, setCart] = useState({});
  //fetch cart from local storage

  useEffect(() => {
    getCart().then((cart) => {
      setCart(JSON.parse(cart));
    });
  }, []);

  useEffect(() => {
    storeCart(JSON.stringify(cart));
    //window.localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      <Router>
        <CartContext.Provider value={{ cart, setCart }}>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            {/* <Route path="/about" element={<About />}></Route> */}
            <Route path="/products" element={<ProductsPage />}></Route>
            <Route path="/Products/:_id" element={<SingleProduct />}></Route>
            <Route path="/cart" element={<Cart />}></Route>
          </Routes>
        </CartContext.Provider>
      </Router>
    </>
  );
};
