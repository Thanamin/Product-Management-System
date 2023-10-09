const express = require('express');
const app = express();
const port = 8500;

app.use(express.json());

// Load database
const products = require('./database.json');

// Middleware to check if a product exists
function productExists(req, res, next) {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found!' });
  }

  req.product = product;
  next();
}

// GET all products
app.get('/products', (req, res) => {
  res.json(products);
});

// GET product by ID
app.get('/products/:id', productExists, (req, res) => {
  res.json(req.product);
});

// DELETE product by ID
app.delete('/products/:id', productExists, (req, res) => {
  const index = products.indexOf(req.product);
  products.splice(index, 1);
  res.status(204).send(); // No content response
});

// POST to add a new product
app.post('/products', (req, res) => {
  const newProduct = req.body;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT to update a product by ID
app.put('/products/:id', productExists, (req, res) => {
  const updatedProduct = req.body;
  Object.assign(req.product, updatedProduct);
  res.json(req.product);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
