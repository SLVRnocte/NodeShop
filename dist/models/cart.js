"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("./product");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// https://stackoverflow.com/questions/40349987/how-to-suppress-error-ts2533-object-is-possibly-null-or-undefined
// Using "!" syntax
// Alternatively: (process.mainModule as NodeModule).filename
const cartPath = path_1.default.join(path_1.default.dirname(process.mainModule.filename), "data", "cart.json");
class Cart {
    static refreshCart(cbDone) {
        fs_1.default.readFile(cartPath, (err, fileContent) => {
            if (!err) {
                this.cartProducts = JSON.parse(fileContent.toString());
            }
            cbDone();
        });
    }
    static getCart(cbDone) {
        this.refreshCart(() => {
            cbDone(this.cartProducts);
        });
        return [];
    }
    static addProduct(productID) {
        const cartProductIndex = this.cartProducts.findIndex(product => product["ProductID"] === productID);
        const cartProduct = this.cartProducts[cartProductIndex];
        if (cartProduct) {
            this.cartProducts[cartProductIndex]["Quantity"] =
                this.cartProducts[cartProductIndex]["Quantity"] + 1;
        }
        else {
            this.cartProducts.push({ ProductID: productID, Quantity: 1 });
        }
        fs_1.default.writeFile(cartPath, JSON.stringify(this.cartProducts), err => {
            if (err)
                console.log(err);
        });
    }
    static deleteProduct(id, cbDone) {
        const updatedCartProducts = this.cartProducts.filter(product => product.ProductID !== id);
        fs_1.default.writeFile(cartPath, JSON.stringify(updatedCartProducts), err => {
            if (err) {
                console.log(err);
            }
            cbDone();
        });
    }
    static getTotalPrice() {
        let totalPrice = 0;
        this.cartProducts.forEach(cartProduct => {
            product_1.Product.findByID(cartProduct["ProductID"])
                .then(product => {
                for (let i = 0; i < cartProduct["Quantity"]; i++) {
                    totalPrice += product.rows[0].price;
                }
            })
                .catch(err => console.log(err));
        });
        return totalPrice;
    }
}
exports.Cart = Cart;
Cart.cartProducts = [];
//# sourceMappingURL=cart.js.map