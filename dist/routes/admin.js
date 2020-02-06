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
var adminController = __importStar(require("../controllers/admin"));
var router = express_1.default.Router();
exports.routes = router;
var adminURLPrefix = "/admin";
router.get(adminURLPrefix + "/add-product", adminController.getAddProduct);
router.get(adminURLPrefix + "/products", adminController.getProducts);
router.post(adminURLPrefix + "/add-product", adminController.postAddProduct);
router.get(adminURLPrefix + "/edit-product/:productID", adminController.getEditProduct);
router.post(adminURLPrefix + "/edit-product", adminController.postEditProduct);
router.post(adminURLPrefix + "/delete-product", adminController.postDeleteProduct);
//# sourceMappingURL=admin.js.map