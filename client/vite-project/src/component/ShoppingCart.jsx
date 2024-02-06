import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ShoppingCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/view-cart')
      .then(response => setCart(response.data.cart))
      .catch(error => console.error('Error fetching cart:', error));
  }, []);

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.name} - Quantity: {item.quantity}, Price: Rs {item.price}, Discount: Rs {item.discount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingCart;

