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
    console.log("this.cart", this.cart);
    const cartProductIndex = this.cart.items.findIndex((item) => {
      return item.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQuantity});
    }

    const updatedCart = {items: updatedCartItems};
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

  getCart() {
    const db = getDb();
    const productsIds = this.cart.items.map((item) => item.productId);

    return db
      .collection("products")
      .find({_id: {$in: productsIds}})
      .toArray()
      .then((products) => {
        console.log("--- getCart user success");
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((item) => item.productId.toString() === product._id.toString()).quantity,
          };
        });
      })
      .catch((error) => {
        console.error("getCart user error", error);
      });
  }

  deleteItemFromCart(productId) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter((item) => productId.toString() !== item.productId.toString());

    return db
      .collection("users")
      .updateOne({_id: new ObjectId(this._id)}, {$set: {cart: {items: updatedCartItems}}})
      .then((result) => {
        console.log("--- deleteItemFromCart user success");
        return result;
      })
      .catch((error) => {
        console.error("deleteItemFromCart user error", error);
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
