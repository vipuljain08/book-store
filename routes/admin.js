const path = require("path");
const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../util/isAuth");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// // /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3, max: 15 })
      .trim()
      .withMessage("Title should be 5 to 15 characters long"),
    body("price").isFloat(),
    body("description")
      .isString()
      .isLength({ min: 20, max: 200 })
      .trim()
      .withMessage("Description should at least 20 to 200 characters long"),
  ],
  isAuth,
  adminController.postAddProduct
);

// // /admin/edit-product => GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// // // /admin/edit-product => POST
router.post(
  "/edit-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3, max: 15 })
      .trim()
      .withMessage("Title should be 5 to 15 characters long"),
    body("imageUrl").isURL().withMessage("Enter a valid URL"),
    body("price").isFloat(),
    body("description")
      .isString()
      .isLength({ min: 20, max: 200 })
      .trim()
      .withMessage("Description should at least 20 to 200 characters long"),
  ],
  isAuth,
  adminController.postEditProduct
);

// // // /admin/delete-product => POST
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

// // // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

module.exports = router;
