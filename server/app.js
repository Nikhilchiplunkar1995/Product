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
    let rows = await db.query('SELECT * FROM products WHERE id = ?', [id]);
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
    let discountAmount = 0;
    if (this.id === 'A' && this.quantity >= 3) {
      discountAmount = Math.floor(this.quantity / 3) * 15;
    } else if (this.id === 'B' && this.quantity >= 2) {
      discountAmount = Math.floor(this.quantity / 2) * 5;
    }
    return discountAmount;
  }
}

class Cart {
  constructor() {
    this.items = [];
  }

  add(item) {
    this.items.push(item);
  }
  calculateTotal(a,b,c,d){
    console.log("A ",a, "B ",b,"C ",c, "D ",d);
    let aDisc=0, bDisc=0,totalDisc=0;
    let total=(a*30+b*20+c*50+d*15)
    if(a>=3){
        aDisc=Math.floor(a/3)*15
    }
    if(b>=2){
    bDisc=Math.floor(b/2)*5
    }
    total=total -aDisc-bDisc
    totalDisc=aDisc+bDisc
    if(total>150){
        totalDisc+=20
        total=total-20
    }
    return {aDisc,bDisc,totalDisc,total}
    
  }
}



const cart = new Cart();

app.post('/add-to-cart', async (req, res) => {
  try {
    const { item_id, quantity } = req.body;
    const product = await Product.find(item_id);
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
    let duplicate = {};
    for (let element of cart.items) {
      let currentItem = element;
      let itemId = currentItem.id;
      if (duplicate.hasOwnProperty(itemId)) {
        duplicate[itemId]++;
      } else {
        duplicate[itemId] = 1;
      }
    }

let keys = ['A', 'B', 'C', 'D'];
let result = {};
keys.forEach(key => {
  result[key] = duplicate.hasOwnProperty(key) ? duplicate[key] : 0;
});

let finalResult = cart.calculateTotal(result.A, result.B, result.C, result.D);
let totalPriceAndQuantity = {};
cart.items.forEach(item => {
  if (!totalPriceAndQuantity[item.id]) {
    totalPriceAndQuantity[item.id] = {
      id: item.id,
      name: item.name,
      price: 0,
      quantity: 0
    };
  }

  totalPriceAndQuantity[item.id].price += item.price;
  totalPriceAndQuantity[item.id].quantity += item.quantity;
});

let finalObj = Object.values(totalPriceAndQuantity);
    res.json({
      cart: finalObj,
      totalPrice: finalResult.total,
      totalDiscount: finalResult.totalDisc,
    });


  } catch (error) {
    console.error('Error viewing cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products', async (req, res) => {
  try {
    let rows = await db.query('SELECT * FROM products');
    res.json({ products: rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

