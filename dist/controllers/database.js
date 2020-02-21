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
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const pg_1 = require("pg");
const product_1 = require("../models/product");
const user_1 = require("../models/user");
const cart_1 = require("../models/cart");
const cartProduct_1 = require("../models/cartProduct");
const order_1 = require("../models/order");
const orderProduct_1 = require("../models/orderProduct");
class DatabaseController {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.User.init(this);
            yield product_1.Product.init(this);
            yield cart_1.Cart.init(this);
            yield cartProduct_1.CartProduct.init(this);
            yield order_1.Order.init(this);
            yield orderProduct_1.OrderProduct.init(this);
            // check if session DB table exists, create if not
            yield this.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'session')").then((result) => __awaiter(this, void 0, void 0, function* () {
                if (!result.rows[0].exists) {
                    yield this.query(fs_1.default.readFileSync('node_modules/connect-pg-simple/table.sql').toString());
                }
            }));
        });
    }
    static query(query, values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.pool.query(query, values);
        });
    }
}
exports.DatabaseController = DatabaseController;
// pools will use environment variables
// for connection information
DatabaseController.pool = new pg_1.Pool();
//# sourceMappingURL=database.js.map