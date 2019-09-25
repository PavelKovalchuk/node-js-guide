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
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, price, description);
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
