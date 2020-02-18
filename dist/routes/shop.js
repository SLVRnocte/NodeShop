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
const express_1 = __importDefault(require("express"));
const shopController = __importStar(require("../controllers/shop"));
const router = express_1.default.Router();
router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productID', shopController.getProduct);
router.get('/orders', shopController.getOrders);
router.post('/create-order', shopController.postOrder);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart-modify-item-quantity', shopController.postCartModifiyItemQuantity);
router.post('/cart-delete-item', shopController.postCartDeleteItem);
router.get('/checkout', shopController.getCheckout);
//module.exports = router;
exports.default = router;
//# sourceMappingURL=shop.js.map