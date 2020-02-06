"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var crypto_1 = __importDefault(require("crypto"));
// https://stackoverflow.com/questions/40349987/how-to-suppress-error-ts2533-object-is-possibly-null-or-undefined
// Using "!" syntax
// Alternatively: (process.mainModule as NodeModule).filename
var productsPath = path_1.default.join(path_1.default.dirname(process.mainModule.filename), "data", "products.json");
var getProductsFromFile = function (cb) {
    fs_1.default.readFile(productsPath, function (err, fileContent) {
        if (err) {
            cb([]);
        }
        else {
            cb(JSON.parse(fileContent.toString()));
        }
    });
};
var Product = /** @class */ (function () {
    function Product(title, imageURL, description, price, id) {
        this.id = id !== undefined ? id : "";
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }
    Product.prototype.save = function () {
        var _this = this;
        getProductsFromFile(function (products) {
            if (_this.id !== "") {
                var existingProductIndex = products.findIndex(function (product) { return product.id === _this.id; });
                var updatedProducts = __spreadArrays(products);
                updatedProducts[existingProductIndex] = _this;
                fs_1.default.writeFile(productsPath, JSON.stringify(updatedProducts), function (err) {
                    if (err)
                        console.log(err);
                });
            }
            else {
                _this.id = crypto_1.default.randomBytes(16).toString("hex");
                products.push(_this);
                fs_1.default.writeFile(productsPath, JSON.stringify(products), function (err) {
                    if (err)
                        console.log(err);
                });
            }
        });
    };
    Product.deleteByID = function (id, cbDone) {
        getProductsFromFile(function (products) {
            var updatedProducts = products.filter(function (product) { return product.id !== id; });
            fs_1.default.writeFile(productsPath, JSON.stringify(updatedProducts), function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    cbDone();
                }
            });
        });
    };
    Product.fetchAll = function (cb) {
        getProductsFromFile(cb);
    };
    Product.findByID = function (id, cb) {
        getProductsFromFile(function (products) {
            var product = products.find(function (p) { return p.id === id; });
            if (product !== undefined) {
                cb(product);
            }
            else {
                throw console.error("Product with ID " + id + " not found!");
            }
        });
    };
    return Product;
}());
exports.Product = Product;
//# sourceMappingURL=product.js.map