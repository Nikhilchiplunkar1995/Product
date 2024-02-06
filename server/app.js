const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'checkout_system',
});

class Product {
  static async find(id) {
    // const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    let rows;
    if(id == 'A'){
      rows= [{id : 'A', name :'Product A', price: 30}]
    }
    if(id == 'B'){
      rows= [{id : 'B', name :'Product B', price: 20}]
    }
    if(id == 'C'){
      rows= [{id : 'C', name :'Product C', price: 50}]
    } 
    if(id == 'D'){
      rows= [{id : 'D', name :'Product D', price: 15}]
    }
    return rows[0];
  }
}

class CartItem {
  constructor(product, quantity) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.quantity = quantity;
  }

  get individualPrice() {
    return this.price * this.quantity;
  }

  get discount() {
    console.log("this.id ===> ",this.id, "this.quantity ===> ",this.quantity);
    if (this.id === 'A' && this.quantity >= 3) {
      return (this.quantity / 3) * (this.price - 75);
    } else if (this.id === 'B' && this.quantity >= 2) {
      return (this.quantity / 2) * (this.price - 35);
    }
    return 0;
  }
}

class Cart {
  constructor() {
    this.items = [];
  }

  add(item) {
    this.items.push(item);
    console.log("this.items ===> ",this.items);
  }

  calculateTotal() {
    let total = 0;
    let totalDiscount = 0;
console.log("this.itemsssss ====> ",this.items);
    for (const item of this.items) {
      total += item.individualPrice;
      totalDiscount += item.discount;
    }

    if (total > 150) {
      totalDiscount += 20;
    }

    return { total, totalDiscount };
  }
}

const cart = new Cart();

app.post('/add-to-cart', async (req, res) => {
  try {
    console.log("req.body ===> ",req.body);
    const { item_id, quantity } = req.body;
    const product = await Product.find(item_id);
console.log("product ===> ",product);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const cartItem = new CartItem(product, quantity);
    cart.add(cartItem);

    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/view-cart', (req, res) => {
  try {
    const { total, totalDiscount } = cart.calculateTotal();
    res.json({
      cart: cart.items.map(item => ({
        ...item,
        individualPrice: item.individualPrice,
        discount: item.discount,
      })),
      totalPrice: total,
      totalDiscount,
    });
  } catch (error) {
    console.error('Error viewing cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products', async (req, res) => {
  try {
    // const [rows] = await db.query('SELECT * FROM products');
    let rows= [{id : 'A', name :'Product A', price: 30},
    {id : 'B', name :'Product B', price: 20},
    {id : 'C', name :'Product C', price: 50},
    {id : 'D', name :'Product D', price: 15}]
    res.json({ products: rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

