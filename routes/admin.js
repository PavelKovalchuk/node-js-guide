const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

// PATH /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// PATH /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// PATH /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);

// PATH /admin/edit-product => GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// PATH /admin/edit-product => POST
router.post("/edit-product", isAuth, adminController.postEditProduct);

// PATH /admin/delete-product => POST
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
