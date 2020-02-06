"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var product_1 = require("./product");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// https://stackoverflow.com/questions/40349987/how-to-suppress-error-ts2533-object-is-possibly-null-or-undefined
// Using "!" syntax
// Alternatively: (process.mainModule as NodeModule).filename
var cartPath = path_1.default.join(path_1.default.dirname(process.mainModule.filename), "data", "cart.json");
var Cart = /** @class */ (function () {
    function Cart() {
    }
    Cart.refreshCart = function (cbDone) {
        var _this = this;
        fs_1.default.readFile(cartPath, function (err, fileContent) {
            if (!err) {
                _this.cartProducts = JSON.parse(fileContent.toString());
            }
            cbDone();
        });
    };
    Cart.getCart = function (cbDone) {
        var _this = this;
        this.refreshCart(function () {
            cbDone(_this.cartProducts);
        });
        return [];
    };
    Cart.addProduct = function (productID) {
        var cartProductIndex = this.cartProducts.findIndex(function (product) { return product["ProductID"] === productID; });
        var cartProduct = this.cartProducts[cartProductIndex];
        if (cartProduct) {
            this.cartProducts[cartProductIndex]["Quantity"] =
                this.cartProducts[cartProductIndex]["Quantity"] + 1;
        }
        else {
            this.cartProducts.push({ ProductID: productID, Quantity: 1 });
        }
        fs_1.default.writeFile(cartPath, JSON.stringify(this.cartProducts), function (err) {
            if (err)
                console.log(err);
        });
    };
    Cart.deleteProduct = function (id, cbDone) {
        var updatedCartProducts = this.cartProducts.filter(function (product) { return product.ProductID !== id; });
        fs_1.default.writeFile(cartPath, JSON.stringify(updatedCartProducts), function (err) {
            if (err) {
                console.log(err);
            }
            cbDone();
        });
    };
    Cart.getTotalPrice = function () {
        var totalPrice = 0;
        this.cartProducts.forEach(function (cartProduct) {
            product_1.Product.findByID(cartProduct["ProductID"], function (product) {
                for (var i = 0; i < cartProduct["Quantity"]; i++) {
                    totalPrice += product.price;
                }
            });
        });
        return totalPrice;
    };
    Cart.cartProducts = [];
    return Cart;
}());
exports.Cart = Cart;
//# sourceMappingURL=cart.js.map