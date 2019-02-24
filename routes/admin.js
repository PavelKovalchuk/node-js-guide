const express = require("express");
const path = require("path");
const router = express.Router();
const rootDir = require("../util/path");

const products = [];

// PATH /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
  console.log("In add-product middleware");
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render('add-product', {pageTitle: "Add product"});
});

// FIlter only GET-request / POST-request
// PATH /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  products.push({title: req.body.title});
  console.log("product req.body: ", req.body);
  res.redirect("/");
});

// module.exports = router;
exports.routes = router;
exports.products = products;
