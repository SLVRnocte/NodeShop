"use strict";
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
var express_1 = __importDefault(require("express"));
var shopController = __importStar(require("../controllers/shop"));
var router = express_1.default.Router();
router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/orders", shopController.getOrders);
router.get("/cart", shopController.getCart);
router.get("/checkout", shopController.getCheckout);
//module.exports = router;
exports.default = router;
