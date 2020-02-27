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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcryptjs"));
const user_1 = require("../models/user");
const database_1 = require("../controllers/database");
const mailer_1 = require("../controllers/mailer");
const setUser = (session, user) => __awaiter(void 0, void 0, void 0, function* () {
    session.user = user;
    session.isLoggedIn =
        session.user.name.toLowerCase() === 'guest' ? false : true;
    return new Promise(resolve => {
        session.save(err => {
            if (err) {
                console.log(err);
            }
            resolve();
        });
    });
});
exports.setUser = setUser;
const getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login',
        errorMsg: req.flash('error').toString()
    });
};
exports.getLogin = getLogin;
const postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    database_1.DatabaseController.query(`SELECT * FROM users WHERE email=$1`, [email]).then(r => {
        if (r.rows[0] === undefined) {
            req.flash('error', 'Invalid E-Mail.');
            return res.redirect('/login');
        }
        bcrypt
            .compare(password, r.rows[0].password)
            .then(match => {
            if (match) {
                user_1.User.findByID(r.rows[0].id)
                    .then((user) => __awaiter(void 0, void 0, void 0, function* () {
                    yield setUser(req.session, user);
                    return res.redirect('/');
                }))
                    .catch(err => console.log(err));
            }
            else {
                // failed, back to login
                req.flash('error', 'Invalid password.');
                return res.redirect('/login');
            }
        })
            .catch(err => {
            console.log(err);
            return res.redirect('/login');
        });
    });
};
exports.postLogin = postLogin;
const postLogout = (req, res, next) => {
    if (req.session !== undefined) {
        logout(req.session);
    }
    res.redirect('/');
};
exports.postLogout = postLogout;
const logout = (session) => {
    return new Promise(resolve => {
        session.destroy(err => {
            if (err)
                console.log(err);
            resolve();
        });
    });
};
const getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: 'signup',
        errorMsg: req.flash('error').toString()
    });
};
exports.getSignup = getSignup;
const postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('/signup');
    }
    if (name.toLowerCase() === 'guest') {
        req.flash('error', 'Invalid name.');
        return res.redirect('/signup');
    }
    database_1.DatabaseController.query(`SELECT EXISTS(select from users where email=$1)`, [email]).then(result => {
        if (result.rows[0].exists) {
            req.flash('error', 'A user with that E-Mail already exists.');
            return res.redirect('/signup');
        }
        bcrypt
            .hash(password, 12)
            .then(hashedPw => {
            const user = new user_1.User(name, email, hashedPw);
            return user.save();
        })
            .then(() => {
            res.redirect('/login');
            return mailer_1.mailer.send({
                to: email,
                from: 'shop@NodeShop.dev',
                subject: 'Signup succeeded!',
                html: `<h1>Thank you for signing up in my NodeShop project, ${name}!</h1>
            <p>You can start using the shop right away!</p>
            <p>In case you have any questions you can reach me on GitHub: <a href="https://github.com/SLVRnocte/">https://github.com/SLVRnocte/</a></p>`
            });
        })
            .catch(err => console.log(err));
    });
};
exports.postSignup = postSignup;
//# sourceMappingURL=auth.js.map