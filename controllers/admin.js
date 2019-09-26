const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  console.log("In add-product middleware");
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.error("postAddProduct err", err));

  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  console.log("In getEditProduct middleware");

  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  console.log("In admin postEditProduct middleware");

  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  const updatedProduct = new Product(productId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  console.log("In admin postDeleteProduct middleware");
  const productId = req.body.productId;
  Product.deleteById(productId);
  res.redirect("/admin/products");
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
