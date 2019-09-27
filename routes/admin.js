const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

// PATH /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// PATH /admin/products => GET
router.get("/products", adminController.getProducts);

// PATH /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

// PATH /admin/edit-product => GET
router.get("/edit-product/:productId", adminController.getEditProduct);

// PATH /admin/edit-product => POST
router.post("/edit-product", adminController.postEditProduct);

// PATH /admin/delete-product => POST
//router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
