const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");

// PATH /admin/add-product => GET
router.get("/add-product", productsController.getAddProduct);

// FIlter only GET-request / POST-request
// PATH /admin/add-product => POST
router.post("/add-product", productsController.postAddProduct);

module.exports = router;
