const express = require("express");
const path = require("path");
const router = express.Router();
const rootDir = require("../util/path");

const adminData = require("./admin");

// function "use" for every upcoming request
router.get("/", (req, res, next) => {
  console.log("In common middleware");
  console.log("SHOP: adminData.products", adminData.products);
  console.log("---------------------");

  // __dirname - absolute path to this file
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
