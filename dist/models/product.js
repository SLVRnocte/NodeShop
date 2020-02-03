"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// https://stackoverflow.com/questions/40349987/how-to-suppress-error-ts2533-object-is-possibly-null-or-undefined
// Using "!" syntax
// Alternatively: (process.mainModule as NodeModule).filename
var productsPath = path_1.default.join(path_1.default.dirname(process.mainModule.filename), "data", "products.json");
var getProductsFromFile = function (cb) {
    fs_1.default.readFile(productsPath, function (err, fileContent) {
        if (err) {
            return cb([]);
        }
        else {
            return cb(JSON.parse(fileContent.toString()));
        }
    });
};
var Product = /** @class */ (function () {
    function Product(title, imageURL, description, price) {
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }
    Product.prototype.save = function () {
        var _this = this;
        getProductsFromFile(function (products) {
            products.push(_this);
            fs_1.default.writeFile(productsPath, JSON.stringify(products), function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    };
    Product.fetchAll = function (cb) {
        getProductsFromFile(cb);
    };
    return Product;
}());
exports.Product = Product;
