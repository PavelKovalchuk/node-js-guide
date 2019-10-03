const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  console.log("In getProducts middleware");

  Product.find()
    // add full data of the object, not just userId
    .populate("userId", "name")
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  console.log("In getProduct middleware");

  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: `Product Detail of ${productId}`,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  console.log("In getIndex middleware");
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        // isAuthenticated: req.session.isLoggedIn,
        // csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  console.log("In getCart middleware");

  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;

      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  console.log("In postCart middleware");

  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("postCart result success");
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  console.log("In postCartDeleteProduct middleware");
  const productId = req.body.productId;

  req.user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrders = (req, res, next) => {
  console.log("In postOrders middleware");

  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {quantity: item.quantity, product: {...item.productId._doc}};
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  console.log("In getOrders middleware");

  Order.find({"user.userId": req.user._id})
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  console.log("In getInvoice middleware");

  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized!"));
      }

      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);
      fs.readFile(invoicePath, (error, data) => {
        if (error) {
          return next(error);
        }
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="' + invoiceName + '"');
        res.send(data);
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
