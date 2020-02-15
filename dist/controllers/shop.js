"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const cart_1 = require("../models/cart");
const getProducts = (req, res, next) => {
    product_1.Product.fetchAll()
        .then(result => {
        res.render('shop/product-list', {
            products: result,
            pageTitle: 'All Products',
            path: 'products'
        });
    })
        .catch(err => console.log(err));
};
exports.getProducts = getProducts;
const getProduct = (req, res, next) => {
    const productID = req.params.productID;
    product_1.Product.findByID(parseInt(productID))
        .then(result => {
        if (result !== undefined) {
            res.render('shop/product-detail', {
                product: result,
                pageTitle: result.title,
                path: 'products'
            });
        }
        else {
            res.redirect('/');
        }
    })
        .catch(err => console.log(err));
};
exports.getProduct = getProduct;
const getIndex = (req, res, next) => {
    product_1.Product.fetchAll()
        .then(result => {
        res.render('shop/index', {
            products: result,
            pageTitle: 'Shop',
            path: 'shop'
        });
    })
        .catch(err => console.log(err));
};
exports.getIndex = getIndex;
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.user.id;
    const cart = new cart_1.Cart(userID);
    cart
        .load()
        .then(() => {
        cart.getTotalPrice().then(totalPrice => {
            res.render('shop/cart', {
                pageTitle: 'Shopping Cart',
                path: 'cart',
                cartProducts: cart.cartProducts,
                totalPrice: totalPrice.toFixed(2)
            });
        });
    })
        .catch(err => console.log(err));
});
exports.getCart = getCart;
const postCart = (req, res, next) => {
    const productID = parseInt(req.body.productID);
    const userID = req.user.id;
    const cart = new cart_1.Cart(userID);
    cart.load().then(() => {
        cart.addProduct(productID).then(() => {
            res.redirect('/cart');
        });
    });
};
exports.postCart = postCart;
const postCartDeleteItem = (req, res, next) => {
    const productID = parseInt(req.body.productID);
    const userID = req.user.id;
    const cart = new cart_1.Cart(userID);
    cart.load().then(() => {
        cart.deleteProduct(productID).then(() => {
            res.redirect('/cart');
        });
    });
};
exports.postCartDeleteItem = postCartDeleteItem;
const postCartModifiyItemQuantity = (req, res, next) => {
    const productID = parseInt(req.body.productID);
    const userID = req.user.id;
    const cart = new cart_1.Cart(userID);
    const modifyType = req.body.modifyType;
    cart.load().then(() => {
        const cartProduct = cart.cartProducts.find(cartProduct => cartProduct.product.id === productID);
        const newQuantity = cartProduct.quantity + (modifyType === 'increase' ? 1 : -1);
        cartProduct.modifyQuantity(newQuantity).then(() => {
            res.redirect('/cart');
        });
    });
};
exports.postCartModifiyItemQuantity = postCartModifiyItemQuantity;
const getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: 'orders'
    });
};
exports.getOrders = getOrders;
const getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: 'checkout'
    });
};
exports.getCheckout = getCheckout;
//# sourceMappingURL=shop.js.map