import React from 'react';

function Cart({ items, totalPrice, totalDiscount }) {
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - Quantity: {item.quantity}, Price: Rs {item.price}, Discount: Rs {item.discount}
          </li>
        ))}
      </ul>
      <div>
        <strong>Total Price:</strong> Rs {totalPrice}
      </div>
      <div>
        <strong>Total Discount:</strong> Rs {totalDiscount}
      </div>
    </div>
  );
}

export default Cart;

