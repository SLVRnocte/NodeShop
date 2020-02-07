"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const db = __importStar(require("../util/database"));
class Product {
    constructor(title, imageURL, description, price, id) {
        this.id = id !== undefined ? id : "";
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }
    save() {
        return db.query('INSERT INTO Products ("title", "price", "description", "imageURL") VALUES ($1, $2, $3, $4)', [this.title, this.price, this.description, this.imageURL]);
    }
    static deleteByID(id) {
        return db.query("DELETE FROM Products WHERE id=$1", [id]);
    }
    static fetchAll() {
        return db.query("SELECT * FROM Products");
    }
    static findByID(id) {
        return db.query("SELECT * FROM Products WHERE id=$1", [id]);
    }
}
exports.Product = Product;
//# sourceMappingURL=product.js.map