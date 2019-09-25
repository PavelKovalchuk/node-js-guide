const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  console.log("In getProducts middleware");
  Product.fetchAll((products) => {
    // Path and file extension is defined in the app.js
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  console.log("In getProduct middleware");

  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    console.log("product", product);
  });

  res.redirect("/");
};

exports.getIndex = (req, res, next) => {
  console.log("In getIndex middleware");
  Product.fetchAll((products) => {
    // Path and file extension is defined in the app.js
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  console.log("In getCart middleware");
  Product.fetchAll((products) => {
    // Path and file extension is defined in the app.js
    res.render("shop/cart", {
      prods: products,
      pageTitle: "Cart",
      path: "/cart",
    });
  });
};

exports.getOrders = (req, res, next) => {
  console.log("In getOrders middleware");
  Product.fetchAll((products) => {
    // Path and file extension is defined in the app.js
    res.render("shop/orders", {
      prods: products,
      pageTitle: "Orders",
      path: "/orders",
    });
  });
};

exports.getCheckout = (req, res, next) => {
  console.log("In getCheckout middleware");
  Product.fetchAll((products) => {
    // Path and file extension is defined in the app.js
    res.render("shop/checkout", {
      prods: products,
      pageTitle: "Checkout",
      path: "/checkout",
    });
  });
};
