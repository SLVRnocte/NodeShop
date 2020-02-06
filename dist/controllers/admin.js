"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_1 = require("../models/product");
var cart_1 = require("../models/cart");
var getAddProduct = function (req, res, next) {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "admin/add-product"
    });
};
exports.getAddProduct = getAddProduct;
var postAddProduct = function (req, res, next) {
    var title = req.body.title;
    var imageURL = req.body.imageURL;
    var description = req.body.description;
    var price = req.body.price;
    var product = new product_1.Product(title, imageURL, description, price);
    product.save();
    res.redirect("/");
};
exports.postAddProduct = postAddProduct;
var getEditProduct = function (req, res, next) {
    if (req.query.edit !== "true") {
        return res.redirect("/");
    }
    var productID = req.params.productID;
    product_1.Product.findByID(productID, function (product) {
        if (!product) {
            return res.redirect("/");
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "admin/edit-product",
            product: product
        });
    });
};
exports.getEditProduct = getEditProduct;
var postEditProduct = function (req, res, next) {
    var productID = req.body.productID;
    var updatedTitle = req.body.title;
    var updatedPrice = req.body.price;
    var updatedImageURL = req.body.imageURL;
    var updatedDescription = req.body.description;
    var updatedProduct = new product_1.Product(updatedTitle, updatedImageURL, updatedDescription, updatedPrice, productID);
    updatedProduct.save();
    res.redirect("/admin/products");
};
exports.postEditProduct = postEditProduct;
var postDeleteProduct = function (req, res, next) {
    var productID = req.body.productID;
    cart_1.Cart.refreshCart(function () {
        cart_1.Cart.deleteProduct(productID, function () {
            product_1.Product.deleteByID(productID, function () {
                res.redirect("/admin/products");
            });
        });
    });
};
exports.postDeleteProduct = postDeleteProduct;
var getProducts = function (req, res, next) {
    product_1.Product.fetchAll(function (products) {
        res.render("admin/products", {
            products: products,
            pageTitle: "Admin Products",
            path: "admin/products"
        });
    });
};
exports.getProducts = getProducts;
//# sourceMappingURL=admin.js.map