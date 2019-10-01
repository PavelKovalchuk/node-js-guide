const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

// function "use" for every upcoming request
router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.post("/cart", isAuth, shopController.postCart);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.post("/create-order", isAuth, shopController.postOrders);

router.get("/orders", isAuth, shopController.getOrders);

module.exports = router;
