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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const fileStorageController = __importStar(require("../controllers/fileStorage"));
const product_1 = require("../models/product");
const cart_1 = require("../models/cart");
const order_1 = require("../models/order");
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
    const productID = parseInt(req.params.productID);
    if (isNaN(productID)) {
        return res.redirect('/');
    }
    product_1.Product.findByID(productID)
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
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = req.session;
    const cart = new cart_1.Cart(session);
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
    if (isNaN(productID)) {
        return res.redirect('/cart');
    }
    const cart = new cart_1.Cart(req.session);
    cart.load().then(() => {
        cart.addProduct(productID).then(() => {
            res.redirect('/cart');
        });
    });
};
exports.postCart = postCart;
const postCartDeleteItem = (req, res, next) => {
    const productID = parseInt(req.body.productID);
    if (isNaN(productID)) {
        return res.redirect('/cart');
    }
    const cart = new cart_1.Cart(req.session);
    cart.load().then(() => {
        cart.deleteProduct(productID).then(() => {
            res.redirect('/cart');
        });
    });
};
exports.postCartDeleteItem = postCartDeleteItem;
const postCartModifiyItemQuantity = (req, res, next) => {
    const productID = parseInt(req.body.productID);
    if (isNaN(productID)) {
        return res.redirect('/cart');
    }
    const cart = new cart_1.Cart(req.session);
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
    const userID = req.session.user.id;
    order_1.Order.fetchAllBelongingToUser(userID).then(orders => {
        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: 'orders',
            orders: orders
        });
    });
};
exports.getOrders = getOrders;
const postOrder = (req, res, next) => {
    const cart = new cart_1.Cart(req.session);
    cart
        .load()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        const newOrder = new order_1.Order(undefined, cart.belongsToUser.id);
        yield newOrder.setup();
        for (const product of cart.cartProducts) {
            for (let i = 0; i < product.quantity; i++) {
                yield newOrder.addProduct(product.product.id);
            }
        }
        return newOrder.save().then(() => {
            return cart.delete();
        });
    }))
        .then(() => {
        res.redirect('/orders');
    });
};
exports.postOrder = postOrder;
const getInvoice = (req, res, next) => {
    const orderID = parseInt(req.params.orderID);
    if (isNaN(orderID) || orderID > Number.MAX_SAFE_INTEGER || orderID < 0) {
        return res.redirect('/orders');
    }
    order_1.Order.findByColumn('id', orderID)
        .then((order) => __awaiter(void 0, void 0, void 0, function* () {
        const userID = req.session.user.id;
        if ((order === null || order === void 0 ? void 0 : order.belongsToUser) !== userID) {
            return res.redirect('/orders');
        }
        const invoiceName = `invoice-${orderID}.pdf`;
        const invoicePath = fileStorageController.invoicePath + invoiceName;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
        const pdf = new pdfkit_1.default();
        pdf.pipe(fs_1.default.createWriteStream(invoicePath));
        pdf.pipe(res);
        pdf
            .fontSize(8)
            .text('This document is strictly for demonstration purposes only and does not represent an actual invoice.', {
            align: 'center'
        })
            .moveDown(5);
        pdf
            .fontSize(15)
            .text(`Order (# ${order.id})`, { align: 'right' })
            .moveDown(1);
        pdf
            .fontSize(36)
            .text('Invoice', {
            underline: true,
            align: 'center'
        })
            .moveDown(2);
        order.orderProducts.forEach(orderProduct => {
            pdf
                .fontSize(14)
                .text(`(${orderProduct.quantity}x) ${orderProduct.product.title} --- Total: $${(orderProduct.quantity * orderProduct.product.price).toFixed(2)}`);
        });
        pdf.moveDown(3);
        let totalPrice = 0;
        yield order.getTotalPrice().then(t => (totalPrice = t));
        pdf
            .fontSize(20)
            .text('Grand Total: $' + totalPrice.toFixed(2))
            .moveDown(3);
        pdf
            .fontSize(8)
            .text('This document is strictly for demonstration purposes only and does not represent an actual invoice.', {
            align: 'center'
        })
            .moveDown(5);
        pdf.end();
        // const fileStream = fs.createReadStream(invoicePath);
        // fileStream.pipe(res);
    }))
        .catch(err => {
        console.log(err);
        return res.redirect('/orders');
    });
};
exports.getInvoice = getInvoice;
const getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: 'checkout'
    });
};
exports.getCheckout = getCheckout;
//# sourceMappingURL=shop.js.map