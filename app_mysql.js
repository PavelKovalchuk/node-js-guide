const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

/**
 * Assigns setting name to value. Sharing data.
 * You may store any value that you want, but certain names can be used to configure the behavior of the server
 *
 * "view engine" -> The default engine extension to use when omitted.
 * "views" -> A directory or an array of directories for the application's views.
 *  If an array, the views are looked up in the order they occur in the array.
 */

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// 3-party package for encoding data in the body
// Middleware pattern
app.use(bodyParser.urlencoded());

// static data (assets) - manages getting files (with .css, .js etc)
app.use(express.static(path.join(__dirname, "public")));

// Add new field (sequelize object) to request object
app.use((res, req, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.error("app.use err", err));
});

// imported routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//404
app.use(errorController.get404);

// Sync models to database (create tables and relations);

// Relations
Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

// many-to-many
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

// one-to-many
Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

sequelize
  // .sync({force: true})
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({name: "Bob", email: "bob.test@test.com"});
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => console.error("sequelize.sync err", err));
