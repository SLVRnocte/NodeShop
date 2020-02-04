"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_1 = require("../models/product");
var cart_1 = require("../models/cart");
var getProducts = function (req, res, next) {
    product_1.Product.fetchAll(function (products) {
        res.render("shop/product-list", {
            products: products,
            pageTitle: "All Products",
            path: "products"
        });
    });
};
exports.getProducts = getProducts;
var getProduct = function (req, res, next) {
    var productID = req.params.productID;
    product_1.Product.findByID(productID, function (product) {
        res.render("shop/product-detail", {
            product: product,
            pageTitle: product.title,
            path: "products"
        });
    });
};
exports.getProduct = getProduct;
var getIndex = function (req, res, next) {
    product_1.Product.fetchAll(function (products) {
        res.render("shop/index", {
            products: products,
            pageTitle: "Shop",
            path: "shop"
        });
    });
};
exports.getIndex = getIndex;
var getCart = function (req, res, next) {
    res.render("shop/cart", {
        pageTitle: "Shopping Cart",
        path: "cart"
    });
};
exports.getCart = getCart;
var postCart = function (req, res, next) {
    var productID = req.body.productID;
    product_1.Product.findByID(productID, function (product) {
        cart_1.Cart.addProduct(productID);
    });
    res.redirect("/cart");
};
exports.postCart = postCart;
var getOrders = function (req, res, next) {
    res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "orders"
    });
};
exports.getOrders = getOrders;
var getCheckout = function (req, res, next) {
    res.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "checkout"
    });
};
exports.getCheckout = getCheckout;
