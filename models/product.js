const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOperation;

    if (this._id) {
      // Update existing one
      dbOperation = db.collection("products").updateOne({_id: this._id}, {$set: this});
    } else {
      // If collection does not exist MongoDB will create it
      dbOperation = db.collection("products").insertOne(this);
    }

    // If collection does not exist MongoDB will create it
    return dbOperation
      .then((result) => {
        console.log("--- save product success");
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
        console.log("--- fetchAll products success");
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
        console.log("--- findById product success");
        return product;
      })
      .catch((error) => {
        console.error("findById product error", error);
      });
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({_id: new mongodb.ObjectId(productId)})
      .then((result) => {
        console.log("--- deleteById product success");
        return result;
      })
      .catch((error) => {
        console.error("deleteById product error", error);
      });
  }
}

module.exports = Product;
