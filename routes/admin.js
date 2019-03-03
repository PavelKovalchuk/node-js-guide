const express = require("express");
const path = require("path");
const router = express.Router();
// const rootDir = require("../util/path");
const productsController = require("../controllers/products");

const products = [];

// PATH /admin/add-product => GET
router.get("/add-product", productsController.getAddProduct);

// FIlter only GET-request / POST-request
// PATH /admin/add-product => POST
router.post("/add-product", productsController.postAddProduct);

// module.exports = router;
module.exports = router;

