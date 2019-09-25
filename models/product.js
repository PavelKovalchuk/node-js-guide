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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // temporary solution for id
    this.id = Math.random().toString();

    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (error) => {
        console.log("save method - writeFile error: ", error);
      });
    });
  }

  static fetchAll(callBack) {
    getProductsFromFile(callBack);
  }
};
