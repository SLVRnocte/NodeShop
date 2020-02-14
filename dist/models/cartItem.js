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
const database_1 = require("../controllers/database");
const product_1 = require("./product");
//@staticImplements<IDatabaseModelStatic>()
class CartItem {
    constructor(id, belongsToUser) {
        this.id = id !== undefined ? id : NaN;
        this.belongsToCart = belongsToCart !== undefined ? belongsToCart : NaN;
    }
    static init(databaseController) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.DatabaseController.query(`CREATE TABLE IF NOT EXISTS ${CartItem.tableName}(
          id INT NOT NULL UNIQUE GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
          belongsToCart INT NOT NULL REFERENCES Cart(id) ON DELETE CASCADE ON UPDATE CASCADE,
          productID INT NOT NULL REFERENCES Product(id) ON DELETE CASCADE ON UPDATE CASCADE
          quantity INT NOT NULL,
          updatedAt TIMESTAMPTZ NOT NULL,
          createdAt TIMESTAMPTZ NOT NULL
        )`);
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Does the cartItem exist in the app
            let result = !isNaN(this.id);
            // Even if so, does it for some reason not exist in the DB?
            // Maybe someone manually inserted a faulty ID into the URL
            if (result) {
                yield database_1.DatabaseController
                    .query(`SELECT EXISTS(select 1 from ${product_1.Product.tableName} where id=$1)`, [this.productID])
                    .then(res => {
                    result = res.rows[0].exists;
                });
            }
            const now = new Date();
            if (!result) {
                return new Promise(res => {
                    database_1.DatabaseController.query(`INSERT INTO ${Cart.tableName} (updatedAt, createdAt, belongsToUser) VALUES ($1, $1, $2) RETURNING *`, [now, this.belongsToUser]).then(result => {
                        this.id = result.rows[0].id;
                        res(result);
                    });
                });
            }
            else {
                return database_1.DatabaseController.query(`UPDATE ${Cart.tableName} SET updatedAt=$1 WHERE id=$2`, [
                    now,
                    this.id
                ]);
            }
        });
    }
    delete() {
        return database_1.DatabaseController.query(`DELETE FROM ${CartItem.tableName} WHERE id=$1`, [this.id]);
    }
    static loadAllBelongingToCart(cartID) {
        return new Promise(resolve => {
            database_1.DatabaseController.query(`SELECT * FROM ${CartItem.tableName} WHERE belongsToCart=$1`, [
                cartID
            ]).then(result => {
                const products = [];
                for (const cartItem of result.rows) {
                    product_1.Product.findByID(cartItem.productID).then(product => {
                        products.push(product);
                    });
                }
            });
        });
    }
}
exports.CartItem = CartItem;
CartItem.tableName = 'CartProducts';
//# sourceMappingURL=cartItem.js.map