const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  console.log("In add-product middleware");
  res.render("add-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    activeAddProduct: true,
    productCss: true,
    formCss: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  console.log("product req.body: ", req.body);
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  console.log("In SHOP middleware");
  Product.fetchAll((products) => {
    // Path and file extension is defined in the app.js
    res.render("shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productCss: true,
    });
  });
};
