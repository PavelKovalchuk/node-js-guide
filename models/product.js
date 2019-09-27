const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    // If collection does not exist MongoDB will create it
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log("save product result", result);
      })
      .catch((error) => {
        console.error("save product error", error);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log("fetchAll products", products);
        return products;
      })
      .catch((error) => {
        console.error("fetchAll products error", error);
      });
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .find({_id: new mongodb.ObjectId(productId)})
      .next()
      .then((product) => {
        console.log("findById product", product);
        return product;
      })
      .catch((error) => {
        console.error("findById product error", error);
      });
  }
}

module.exports = Product;
