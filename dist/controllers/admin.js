"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const cart_1 = require("../models/cart");
const getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "admin/add-product"
    });
};
exports.getAddProduct = getAddProduct;
const postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    const product = new product_1.Product(title, imageURL, description, price);
    product
        .save()
        .then(() => res.redirect("/"))
        .catch(err => console.log(err));
};
exports.postAddProduct = postAddProduct;
const getEditProduct = (req, res, next) => {
    if (req.query.edit !== "true") {
        return res.redirect("/");
    }
    const productID = req.params.productID;
    product_1.Product.findByID(productID)
        .then(product => {
        if (!product) {
            return res.redirect("/");
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "admin/edit-product",
            product: product.rows[0]
        });
    })
        .catch(err => console.log(err));
};
exports.getEditProduct = getEditProduct;
const postEditProduct = (req, res, next) => {
    const productID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageURL = req.body.imageURL;
    const updatedDescription = req.body.description;
    const updatedProduct = new product_1.Product(updatedTitle, updatedImageURL, updatedDescription, updatedPrice, productID);
    updatedProduct
        .save()
        .then(() => {
        res.redirect("/admin/products");
    })
        .catch(err => console.log(err));
};
exports.postEditProduct = postEditProduct;
const postDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;
    cart_1.Cart.refreshCart(() => {
        cart_1.Cart.deleteProduct(productID, () => {
            product_1.Product.deleteByID(productID)
                .then(() => {
                res.redirect("/admin/products");
            })
                .catch(err => console.log(err));
        });
    });
};
exports.postDeleteProduct = postDeleteProduct;
const getProducts = (req, res, next) => {
    product_1.Product.fetchAll()
        .then(products => {
        res.render("admin/products", {
            products: products.rows,
            pageTitle: "Admin Products",
            path: "admin/products"
        });
    })
        .catch(err => console.log(err));
};
exports.getProducts = getProducts;
//# sourceMappingURL=admin.js.map