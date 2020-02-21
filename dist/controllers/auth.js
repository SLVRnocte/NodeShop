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
const user_1 = require("../models/user");
const setUser = (session, user) => {
    session.user = user;
    return new Promise(resolve => {
        session.save(err => {
            if (err)
                console.log(err);
            resolve();
        });
    });
};
exports.setUser = setUser;
const getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login',
        isLoggedIn: req.session.isLoggedIn
    });
};
exports.getLogin = getLogin;
const postLogin = (req, res, next) => {
    // Fake login with dummy user
    user_1.User.findByID(1)
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        // Dummy doesn't exist, create
        if (!user) {
            user = new user_1.User('Test User', 'Test@testerino.com');
            yield user.save();
        }
        req.session.isLoggedIn = true;
        yield setUser(req.session, user);
    }))
        .catch(err => console.log(err));
    res.redirect('/');
};
exports.postLogin = postLogin;
const postLogout = (req, res, next) => {
    var _a;
    (_a = req.session) === null || _a === void 0 ? void 0 : _a.destroy(err => {
        if (err)
            console.log(err);
        res.redirect('/');
    });
};
exports.postLogout = postLogout;
//# sourceMappingURL=auth.js.map