const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(process.mainModule.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = {products: [], totalPrice: 0};

      // Fetch the prev cart
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // Analyze the cart => find existing product
      const existingProductIndex = cart.products.findIndex((product) => product.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      // Add new product OR  increase quantity
      if (existingProduct) {
        updatedProduct = {...existingProduct, qty: existingProduct.qty + 1};
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {id: id, qty: 1};
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + parseFloat(productPrice);

      // Save data to file
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.error("Cart error: ", err);
        }
      });
    });
  }
};