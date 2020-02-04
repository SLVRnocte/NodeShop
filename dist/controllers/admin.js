"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_1 = require("../models/product");
var getAddProduct = function (req, res, next) {
    res.render("admin/add-product", {
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
