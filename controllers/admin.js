const Product = require("../models/product");
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isError: false,
    errorMessage: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.file;
  const description = req.body.description;
  const price = req.body.price;
  console.log(imageUrl)
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      prods: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      isError: true,
      errorMessage: error.array()[0].msg,
      editing: false,
    });
  }
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        prods: product,
        editing: true,
        isError: false,
        errorMessage: null,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const { title, imageUrl, price, description } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      prods: {
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        _id: prodId,
      },
      editing: true,
      isError: true,
      errorMessage: error.array()[0].msg,
    });
  }
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save().then(() => {
        console.log("Product Updated");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      // .deleteItemFromCart(prodId)
      console.log("Destroyed Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
