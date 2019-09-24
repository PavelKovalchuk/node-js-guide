const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");

// function "use" for every upcoming request
router.get("/", productsController.getProducts);

module.exports = router;
