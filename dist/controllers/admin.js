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
const getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: 'admin/add-product'
    });
};
exports.getAddProduct = getAddProduct;
const postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    const createdBy = req.session.user.id;
    const product = new product_1.Product(title, imageURL, description, price, undefined, createdBy);
    product
        .save()
        .then(() => res.redirect('/'))
        .catch(err => console.log(err));
};
exports.postAddProduct = postAddProduct;
const getProducts = (req, res, next) => {
    const userID = req.session.user.id;
    product_1.Product.fetchAll()
        .then(products => {
        products = products.filter(p => p.createdByUser === userID);
        res.render('admin/products', {
            products: products,
            pageTitle: 'Admin Products',
            path: 'admin/products'
        });
    })
        .catch(err => console.log(err));
};
exports.getProducts = getProducts;
const getEditProduct = (req, res, next) => {
    if (req.query.edit !== 'true') {
        return res.redirect('/');
    }
    const productID = parseInt(req.params.productID);
    if (isNaN(productID)) {
        return res.redirect('/admin/products');
    }
    const userID = req.session.user.id;
    product_1.Product.findByID(productID)
        .then(product => {
        if (product === undefined || product.createdByUser !== userID) {
            return res.redirect('/admin/products');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: 'admin/edit-product',
            product: product
        });
    })
        .catch(err => console.log(err));
};
exports.getEditProduct = getEditProduct;
const postEditProduct = (req, res, next) => {
    const productID = parseInt(req.body.productID);
    if (isNaN(productID)) {
        return res.redirect('/admin/products');
    }
    const userID = req.session.user.id;
    product_1.Product.findByID(productID)
        .then(product => {
        if (product === undefined || product.createdByUser !== userID) {
            return res.redirect('/admin/products');
        }
        product.title = req.body.title;
        product.price = req.body.price;
        product.imageURL = req.body.imageURL;
        product.description = req.body.description;
        product
            .save()
            .then(() => {
            res.redirect('/admin/products');
        })
            .catch(err => console.log(err));
    })
        .catch(err => console.log(err));
};
exports.postEditProduct = postEditProduct;
const postDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;
    const userID = req.session.user.id;
    product_1.Product.findByID(productID)
        .then((product) => __awaiter(void 0, void 0, void 0, function* () {
        if (product === undefined || product.createdByUser !== userID) {
            return res.redirect('/admin/products');
        }
        yield product.delete();
    }))
        .then(() => {
        res.redirect('/admin/products');
    })
        .catch(err => console.log(err));
};
exports.postDeleteProduct = postDeleteProduct;
//# sourceMappingURL=admin.js.map