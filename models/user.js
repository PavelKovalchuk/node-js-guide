const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function(product) {
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
    updatedCartItems.push({productId: product._id, quantity: newQuantity});
  }

  const updatedCart = {items: updatedCartItems};
  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter((item) => productId.toString() !== item.productId.toString());
  this.cart.items = updatedCartItems;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

/* const mongodb = require("mongodb");
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

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = {items: []};
        return db.collection("users").updateOne({_id: new ObjectId(this._id)}, {$set: {cart: {items: []}}});
      })
      .then((result) => {
        console.log("--- addOrder user success");
        return result;
      })
      .catch((error) => {
        console.error("addOrder user error", error);
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({"user._id": new ObjectId(this._id)})
      .toArray()
      .then((result) => {
        console.log("--- addOrder user success");
        return result;
      })
      .catch((error) => {
        console.error("addOrder user error", error);
      });
  }

}

module.exports = User;
 */
