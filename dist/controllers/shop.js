"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const cart_1 = require("../models/cart");
const getProducts = (req, res, next) => {
    product_1.Product.fetchAll()
        .then(result => {
        res.render("shop/product-list", {
            products: result.rows,
            pageTitle: "All Products",
            path: "products"
        });
    })
        .catch(err => console.log(err));
};
exports.getProducts = getProducts;
const getProduct = (req, res, next) => {
    const productID = req.params.productID;
    product_1.Product.findByID(productID)
        .then(result => {
        res.render("shop/product-detail", {
            product: result.rows[0],
            pageTitle: result.rows[0].title,
            path: "products"
        });
    })
        .catch(err => console.log(err));
};
exports.getProduct = getProduct;
const getIndex = (req, res, next) => {
    product_1.Product.fetchAll()
        .then(result => {
        res.render("shop/index", {
            products: result.rows,
            pageTitle: "Shop",
            path: "shop"
        });
    })
        .catch(err => console.log(err));
};
exports.getIndex = getIndex;
const getCart = (req, res, next) => {
    cart_1.Cart.getCart(cart => {
        product_1.Product.fetchAll()
            .then(result => {
            const products = result.rows;
            //console.log(products.find(product => 1 === parseInt(product.id)));
            const cartProducts = [];
            cart.forEach(cartProduct => {
                const product = products.find(product => cartProduct.ProductID === product.id.toString());
                if (product !== undefined) {
                    cartProducts.push({
                        product: product,
                        quantity: cartProduct.Quantity
                    });
                }
            });
            res.render("shop/cart", {
                pageTitle: "Shopping Cart",
                path: "cart",
                products: cartProducts
            });
        })
            .catch(err => console.log(err));
    });
};
exports.getCart = getCart;
const postCart = (req, res, next) => {
    const productID = req.body.productID;
    cart_1.Cart.refreshCart(() => {
        cart_1.Cart.addProduct(productID);
        res.redirect("/cart");
    });
};
exports.postCart = postCart;
const postCartDeleteItem = (req, res, next) => {
    const productID = req.body.productID;
    cart_1.Cart.deleteProduct(productID, () => {
        res.redirect("/cart");
    });
};
exports.postCartDeleteItem = postCartDeleteItem;
const getOrders = (req, res, next) => {
    res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "orders"
    });
};
exports.getOrders = getOrders;
const getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "checkout"
    });
};
exports.getCheckout = getCheckout;
//# sourceMappingURL=shop.js.map