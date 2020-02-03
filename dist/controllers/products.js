"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_1 = require("../models/product");
var getAddProduct = function (req, res, next) {
    res.render("admin/add-product", {
        pageTitle: "Add Product",
        path: "add-product"
    });
};
exports.getAddProduct = getAddProduct;
var postAddProduct = function (req, res, next) {
    var product = new product_1.Product(req.body.title);
    product.save();
    res.redirect("/");
};
exports.postAddProduct = postAddProduct;
var getProducts = function (req, res, next) {
    product_1.Product.fetchAll(function (products) {
        res.render("shop/product-list", {
            products: products,
            pageTitle: "Shop",
            path: "shop"
        });
    });
};
exports.getProducts = getProducts;
