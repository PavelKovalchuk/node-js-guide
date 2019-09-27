const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");

// function "use" for every upcoming request
router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.post("/cart", shopController.postCart);

/* router.get("/cart", shopController.getCart);

router.post("/cart-delete-item", shopController.postCartDeleteProduct);

router.post("/create-order", shopController.postOrders);

router.get("/orders", shopController.getOrders); */

module.exports = router;
