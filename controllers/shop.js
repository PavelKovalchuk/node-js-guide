const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  console.log("In getProducts middleware");
  Product.fetchAll()
    .then(([rows]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All products",
        path: "/products",
      });
    })
    .catch((err) => console.error("getProducts err", err));
};

exports.getProduct = (req, res, next) => {
  console.log("In getProduct middleware");

  const productId = req.params.productId;
  Product.findById(productId)
    .then(([productArr]) => {
      res.render("shop/product-detail", {
        product: productArr[0],
        pageTitle: `Product Detail of ${productId}`,
        path: "/products",
      });
    })
    .catch((err) => console.error("getProduct err", err));
};

exports.getIndex = (req, res, next) => {
  console.log("In getIndex middleware");
  Product.fetchAll()
    .then(([rows, metaData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.error("getIndex err", err));
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
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  console.log("In postCartDeleteProduct middleware");

  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
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
