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
const express_validator_1 = require("express-validator");
const validator_1 = __importDefault(require("validator"));
const adminController = __importStar(require("../controllers/admin"));
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const router = express_1.default.Router();
const adminURLPrefix = '/admin';
router.get(`${adminURLPrefix}/add-product`, is_auth_1.default, adminController.getAddProduct);
router.get(`${adminURLPrefix}/products`, is_auth_1.default, adminController.getProducts);
router.post(`${adminURLPrefix}/add-product`, [
    express_validator_1.body('title')
        .custom(value => {
        // Custom validator
        // Name has to be alphanumeric however spaces are allowed
        if (!validator_1.default.isAlphanumeric(validator_1.default.blacklist(value, ' '))) {
            return false;
        }
        return true;
    })
        .trim(),
    //body('image').exists(),
    express_validator_1.body('price').isFloat(),
    express_validator_1.body('description').isLength({ min: 1 })
], is_auth_1.default, adminController.postAddProduct);
router.get(`${adminURLPrefix}/edit-product/:productID`, is_auth_1.default, adminController.getEditProduct);
router.post(`${adminURLPrefix}/edit-product`, [
    express_validator_1.body('title')
        .custom(value => {
        // Custom validator
        // Name has to be alphanumeric however spaces are allowed
        if (!validator_1.default.isAlphanumeric(validator_1.default.blacklist(value, ' '))) {
            return false;
        }
        return true;
    })
        .trim(),
    //body('imageURL').isURL(),
    express_validator_1.body('price').isFloat(),
    express_validator_1.body('description').isLength({ min: 1 })
], is_auth_1.default, adminController.postEditProduct);
router.post(`${adminURLPrefix}/delete-product`, is_auth_1.default, adminController.postDeleteProduct);
exports.default = router;
//# sourceMappingURL=admin.js.map