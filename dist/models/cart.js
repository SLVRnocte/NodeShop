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
var productsPath = path_1.default.join(path_1.default.dirname(process.mainModule.filename), "data", "cart.json");
var Cart = /** @class */ (function () {
    function Cart() {
    }
    Cart.addProduct = function (productID) {
        var _this = this;
        fs_1.default.readFile(productsPath, function (err, fileContent) {
            //   let cart: { products: [string, number][], totalPrice: number } = {
            //     products: [],
            //     totalPrice: 0
            //   };
            if (!err) {
                // cart = JSON.parse(fileContent.toString());
                _this.products = JSON.parse(fileContent.toString());
            }
            var cartProductIndex = _this.products.findIndex(function (product) { return product[0] === productID; });
            var cartProduct = _this.products[cartProductIndex];
            if (cartProduct) {
                _this.products[cartProductIndex][1] =
                    _this.products[cartProductIndex][1] + 1;
            }
            else {
                _this.products.push([productID, 1]);
            }
            fs_1.default.writeFile(productsPath, JSON.stringify(_this.products), function (err) {
                console.log(err);
            });
        });
    };
    Cart.getTotalPrice = function () {
        var totalPrice = 0;
        this.products.forEach(function (product) {
            product_1.Product.findByID(product[0], function (product) {
                totalPrice += product.price;
            });
        });
        return totalPrice;
    };
    Cart.products = [];
    return Cart;
}());
exports.Cart = Cart;
