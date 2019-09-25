const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

// PATH /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// PATH /admin/products => GET
router.get("/products", adminController.getProducts);

// FIlter only GET-request / POST-request
// PATH /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

module.exports = router;
