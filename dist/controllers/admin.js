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
const express_validator_1 = require("express-validator");
const fileHelper_1 = require("../util/fileHelper");
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
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const createdBy = req.session.user.id;
    const validationErrors = express_validator_1.validationResult(req);
    if (!validationErrors.isEmpty() || image === undefined) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: 'admin/add-product',
            errorMsg: image
                ? validationErrors.array()[0].msg
                : 'Attached file is not an image',
            successMsg: req.flash('success').toString(),
            product: {
                title: title,
                //image: image ? image : undefined,
                price: price,
                description: description
            }
        });
    }
    const product = new product_1.Product(title, image.filename, description, price, undefined, createdBy);
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
        const image = req.file;
        if (image) {
            fileHelper_1.deleteFile(product.imagePath);
            product.imageURL = image.filename;
        }
        product.title = req.body.title;
        product.price = req.body.price;
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
const deleteProduct = (req, res, next) => {
    const productID = parseInt(req.params.productID);
    const userID = req.session.user.id;
    product_1.Product.findByID(productID)
        .then((product) => __awaiter(void 0, void 0, void 0, function* () {
        if (product === undefined || product.createdByUser !== userID) {
            return res.redirect('/admin/products');
        }
        fileHelper_1.deleteFile(product.imagePath);
        yield product.delete();
    }))
        .then(() => {
        // res.redirect('/admin/products');
        res.status(200).json({ message: 'Success!' });
    })
        .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Deleting product failed.' });
    });
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=admin.js.map