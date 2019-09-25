const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(process.mainModule.filename), "data", "products.json");

const getProductsFromFile = (callBack) => {
  fs.readFile(p, (error, fileContent) => {
    if (error) {
      callBack([]);
    } else {
      callBack(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      // Update product
      if (this.id) {
        const existingProductIndex = products.findIndex((product) => product.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
          if (error) {
            console.log("save method - writeFile error: ", error);
          }
        });
      } else {
        // temporary solution for id
        this.id = Math.random().toString();

        // Create new one product
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (error) => {
          if (error) {
            console.log("save method - writeFile error: ", error);
          }
        });
      }
    });
  }

  static fetchAll(callBack) {
    getProductsFromFile(callBack);
  }

  static findById(id, callback) {
    getProductsFromFile((products) => {
      const product = products.find((product) => {
        return id === product.id;
      });
      callback(product);
    });
  }
};
