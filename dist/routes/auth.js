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
const authController = __importStar(require("../controllers/auth"));
const user_1 = require("../models/user");
const router = express_1.default.Router();
router.get('/login', authController.getLogin);
router.post('/login', [
    // Check email
    express_validator_1.body('email', 'Please enter a valid e-mail address.')
        .isEmail()
        .normalizeEmail()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        return user_1.User.findByColumn('email', value).then(result => {
            if (!result) {
                return Promise.reject('No user with that email has been found.');
            }
        });
    }))
], authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', [
    // Form Validators
    // Check Name
    express_validator_1.body('name', `Please enter a valid name. <br>
    Valid Characters for your name: (a-z, A-Z).`).custom(name => {
        // Custom validator
        // Name has to be alphanumeric however spaces are allowed
        if (!validator_1.default.isAlphanumeric(validator_1.default.blacklist(name, ' '))) {
            return false;
        }
        // Reject "guest"
        if (name.toLowerCase() === 'guest') {
            return false;
        }
        return true;
    }),
    // Check email
    express_validator_1.check('email', 'Please enter a valid e-mail address.')
        .isEmail()
        .normalizeEmail()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        return user_1.User.findByColumn('email', value).then(result => {
            if (result) {
                return Promise.reject('A user with that E-Mail already exists.');
            }
        });
    })),
    // Check password
    express_validator_1.check('password', 'Please enter a valid password with at least 5 characters.').isLength({ min: 5, max: 128 }),
    // Check confirm password
    express_validator_1.body('confirmPassword').custom((confirmPassword, { req }) => {
        // confirmPassword == '' is redundant however its here to flash the field if all
        // fields are empty and the form is being submitted
        if (confirmPassword !== req.body.password || confirmPassword == '') {
            throw new Error('Passwords do not match.');
        }
        return true;
    })
], authController.postSignup);
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);
router.get('/reset-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map