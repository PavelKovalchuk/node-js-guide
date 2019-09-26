const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  console.log("In getProducts middleware");

  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All products",
        path: "/products",
      });
    })
    .catch((err) => console.error("getProducts err", err));
};

exports.getProduct = (req, res, next) => {
  console.log("In getProduct middleware");

  const productId = req.params.productId;
  Product
    // .findByPk(productId)
    .findAll({where: {id: productId}})
    .then((products) => {
      res.render("shop/product-detail", {
        product: products[0],
        pageTitle: `Product Detail of ${productId}`,
        path: "/products",
      });
    })
    .catch((err) => console.error("getProduct err", err));
};

exports.getIndex = (req, res, next) => {
  console.log("In getIndex middleware");
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.error("getIndex err", err));
};

exports.getCart = (req, res, next) => {
  console.log("In getCart middleware");

  res.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((cartProducts) => {
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: cartProducts,
      });
    })
    .catch((err) => console.error("getCart err", err));
};

exports.postCart = (req, res, next) => {
  console.log("In postCart middleware");

  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  res.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({where: {id: productId}});
    })
    .then((cartProducts) => {
      let product;
      if (cartProducts.length > 0) {
        product = cartProducts[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.error("getCart err", err));
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
