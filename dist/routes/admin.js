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
const adminController = __importStar(require("../controllers/admin"));
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const router = express_1.default.Router();
const adminURLPrefix = '/admin';
router.get(`${adminURLPrefix}/add-product`, is_auth_1.default, adminController.getAddProduct);
router.get(`${adminURLPrefix}/products`, is_auth_1.default, adminController.getProducts);
router.post(`${adminURLPrefix}/add-product`, is_auth_1.default, adminController.postAddProduct);
router.get(`${adminURLPrefix}/edit-product/:productID`, is_auth_1.default, adminController.getEditProduct);
router.post(`${adminURLPrefix}/edit-product`, is_auth_1.default, adminController.postEditProduct);
router.post(`${adminURLPrefix}/delete-product`, is_auth_1.default, adminController.postDeleteProduct);
/*exports.routes = router;
exports.products = products;*/
exports.default = router;
//# sourceMappingURL=admin.js.map