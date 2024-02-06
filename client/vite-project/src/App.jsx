// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App



























// import React, { useState } from 'react';
// import ProductList from './component/ProductList';
// import ShoppingCart from './component/ShoppingCart';
// import axios from 'axios';


// function App() {
//   const [cart, setCart] = useState([]);

//   const addToCart = (product) => {
//     axios.post('http://localhost:3001/add-to-cart', { item_id: product.id, quantity: 1 })
//       .then(response => {
//         console.log("response ====> ",response);
//         console.log(response.data.message);
//         setCart([...cart, { ...product, quantity: 1 }]);
//       })
//       .catch(error => console.error('Error adding to cart:', error));
//   };

//   return (
//     <div className="App">
//       <h1>Checkout System</h1>
//       <div className="container">
//         <ProductList addToCart={addToCart} />
//         <ShoppingCart cart={cart} />
//       </div>
//     </div>
//   );
// }

// export default App;
















import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    axios.get('http://localhost:3001/products')
      .then(response => setProducts(response.data.products))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const addToCart = (item) => {
    // Implement logic to add items to the cart
    // Send a POST request to the backend
    axios.post('http://localhost:3001/add-to-cart', { item_id: item.id, quantity: 1 })
      .then(response => console.log(response.data.message))
      .catch(error => console.error('Error adding to cart:', error));
  };

  const viewCart = () => {
    // Implement logic to view the cart
    // Send a GET request to the backend
    axios.get('http://localhost:3001/view-cart')
      .then(response => {
        console.log(response.data);
        setCart(response.data.cart);
      })
      .catch(error => console.error('Error viewing cart:', error));
  };

  return (
    <div>
      <h1>Checkout System</h1>
      <div>
        <h2>Products</h2>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.name} - Rs {product.price}
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Cart</h2>
        <button onClick={viewCart}>View Cart</button>
        <ul>
          {cart.map(item => (
            <li key={item.id}>
              {item.name} - Quantity: {item.quantity}, Price: Rs {item.price}, Discount: Rs {item.discount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

