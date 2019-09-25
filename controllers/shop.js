const Product = require("../models/product");
const Cart = require("../models/cart");

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
    res.render("shop/product-detail", {
      product: product,
      pageTitle: `Product Detail of ${productId}`,
      path: "/products",
    });
  });
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

  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find((cartProduct) => cartProduct.id === product.id);
        if (cartProductData) {
          cartProducts.push({productData: product, qty: cartProductData.qty});
        }
      }

      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  console.log("In postCart middleware");

  const productId = req.body.productId;
  console.log("productId", productId);
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
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
