const express = require("express");
const path = require("path");
const router = express.Router();
const rootDir = require("../util/path");

// PATH /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
  console.log("In add-product middleware");
  console.log("rootDir", rootDir);
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

// FIlter only GET-request / POST-request
// PATH /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  console.log("product req.body: ", req.body);
  res.redirect("/");
});

module.exports = router;
