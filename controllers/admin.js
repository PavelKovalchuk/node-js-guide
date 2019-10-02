const Product = require("../models/product");
const {validationResult} = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  console.log("In add-product middleware");
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    // Or we can use req.user
    userId: req.user,
  })
    .save()
    .then((result) => {
      console.log("--- Product has been created!", result);
      res.redirect("/");
    })
    .catch((err) => console.error("postAddProduct err", err));
};

exports.getEditProduct = (req, res, next) => {
  console.log("In getEditProduct middleware");

  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => console.error("admin getEditProduct err", err));
};

exports.postEditProduct = (req, res, next) => {
  console.log("In admin postEditProduct middleware");

  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDescription,
        _id: productId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      return product.save().then((result) => {
        console.log(`Updated product with ID: ${productId}`);
        res.redirect("/admin/products");
      });
    })
    .catch((err) => console.error("admin postEditProduct err", err));
};

exports.postDeleteProduct = (req, res, next) => {
  console.log("In admin postDeleteProduct middleware");
  const productId = req.body.productId;
  Product.deleteOne({_id: productId, userId: req.user._id})
    .then((result) => {
      console.log(`Removed product with ID: ${productId}`);
      res.redirect("/admin/products");
    })
    .catch((err) => console.error("admin postDeleteProduct err", err));
};

exports.getProducts = (req, res, next) => {
  console.log("In admin getProducts middleware");

  Product.find({userId: req.user._id})
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.error("admin getProducts err", err));
};
