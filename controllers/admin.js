const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    userId: req.user._id
  });
  product
    .save()
    .then((result) => {
      console.log("Created Product");
    })
    .catch((err) => console.log(err));
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  Product.findById(prodId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "",
        product: product,
        editing: editMode,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  Product.findById(prodId).then((product) => {
    product.title = title;
    product.imageUrl = imageUrl;
    product.description = description;
    product.price = price;
    product
      .save()
      .then((result) => console.log("Updated Successfully."))
      .catch((err) => console.log(err));
  });
  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.find()
  .select("title price -_id")
  .populate("userId", "-email")
    .then((products) => {
      console.log(products)
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  Product.findByIdAndRemove(prodId)
  .then(() => console.log("product deleted successfully"))
  .catch(err => console.log(err));
  res.redirect('/admin/products');
};
