const express = require("express");
const path = require("path");
const router = express.Router();
// const rootDir = require("../util/path");
const productsController = require("../controllers/products");

// function "use" for every upcoming request
router.get("/", productsController.getProducts);

module.exports = router;
