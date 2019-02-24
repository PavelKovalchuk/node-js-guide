const express = require("express");
const path = require("path");
const router = express.Router();
const rootDir = require("../util/path");

const adminData = require("./admin");

// function "use" for every upcoming request
router.get("/", (req, res, next) => {
  console.log("In SHOP middleware");
  console.log("SHOP: adminData.products", adminData.products);
  const products = adminData.products;

  // __dirname - absolute path to this file
  // This is for static html
  // res.sendFile(path.join(rootDir, "views", "shop.html"));

  // This is for dynamic templates. Path and file extension is defined in the app.js
  res.render('shop', {prods: products, docTitle: "Shop"});
});

module.exports = router;
