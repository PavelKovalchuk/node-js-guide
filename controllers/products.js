const products = [];

exports.getAddProduct = (req, res, next) => {
  console.log("In add-product middleware");
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render(
    'add-product',
    {
      pageTitle: "Add product",
      path: "/admin/add-product",
      activeAddProduct: true,
      productCss: true,
      formCss: true,
    }
  );
};

exports.postAddProduct = (req, res, next) => {
  products.push({title: req.body.title});
  console.log("product req.body: ", req.body);
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  console.log("In SHOP middleware");
   // __dirname - absolute path to this file
  // This is for static html
  // res.sendFile(path.join(rootDir, "views", "shop.html"));

  // This is for dynamic templates. Path and file extension is defined in the app.js
  res.render(
    'shop',
    {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts:  products.length > 0,
      activeShop: true,
      productCss: true,
      // special key for handlebars
      // layout: true,
    }
  );
};