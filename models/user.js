const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();

    // If collection does not exist MongoDB will create it
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log("--- save user success");
      })
      .catch((error) => {
        console.error("save user error", error);
      });
  }

  addToCart(product) {
    // const cartProduct = this.cart.items.findIndex((item) => {
    //   return item._id === product._id;
    // });

    const updatedCart = [{items: {productId: new ObjectId(product._id), quantity: 1}}];
    const db = getDb();
    return db
      .collection("users")
      .updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}})
      .then((result) => {
        console.log("--- addToCart user success");
        return result;
      })
      .catch((error) => {
        console.error("addToCart user error", error);
      });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({_id: new ObjectId(userId)})
      .then((user) => {
        console.log("--- findById user success");
        return user;
      })
      .catch((error) => {
        console.error("findById user error", error);
      });
  }
}

module.exports = User;
