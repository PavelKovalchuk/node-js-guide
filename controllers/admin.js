const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  console.log("In add-product middleware");
  res.render("admin/add-product", {
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
  console.log("In admin getProducts middleware");
  Product.fetchAll((products) => {
    // Path and file extension is defined in the app.js
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin products",
      path: "/admin/products",
    });
  });
};
