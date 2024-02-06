import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [cartViewed, setCartViewed] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/products')
      .then(response => setProducts(response.data.products))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const addToCart = (item) => {
    axios.post('http://localhost:3001/add-to-cart', { item_id: item.id, quantity: 1 })
      .then(response => {
        console.log(response.data.message);
        viewCart();
      })
      .catch(error => console.error('Error adding to cart:', error));
  };

  const viewCart = () => {
    axios.get('http://localhost:3001/view-cart')
      .then(response => {
        console.log(response.data);
        setCart(response.data.cart);
        setTotalPrice(response.data.totalPrice);
        setTotalDiscount(response.data.totalDiscount);
        setCartViewed(true);
      })
      .catch(error => console.error('Error viewing cart:', error));
  };

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - Rs {product.price}
            <button onClick={() => addToCart(product)} className="addToCartButton"
            >Add to Cart</button>
          </li>
        ))}
      </ul>
      <div>
        <h2>View Cart</h2>
        {/* <button onClick={viewCart}>View Cart</button> */}
        {cartViewed && (
          <div>
            <ul>
              {cart.map(item => (
                <li key={item.id}>
                  {item.name} - Quantity: {item.quantity}, Price: Rs {item.price}
                </li>
              ))}
            </ul>
            <p>Total Price: Rs {totalPrice}, Total Discount: Rs {totalDiscount}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;





