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
const express_validator_1 = require("express-validator");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt = __importStar(require("bcryptjs"));
const user_1 = require("../models/user");
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
        errorMsg: req.flash('error').toString(),
        successMsg: req.flash('success').toString(),
        oldInput: {
            email: ''
        },
        validationErrors: []
    });
};
exports.getLogin = getLogin;
const postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // All validation is being handled in routes/auth
    const validationErrors = express_validator_1.validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: 'login',
            errorMsg: validationErrors.array()[0].msg,
            successMsg: req.flash('success').toString(),
            oldInput: {
                email: email
            },
            validationErrors: validationErrors.array()
        });
    }
    // Check password
    user_1.User.findByColumn('email', email).then(user => {
        bcrypt
            .compare(password, user.hashedPassword)
            .then((match) => __awaiter(void 0, void 0, void 0, function* () {
            if (match) {
                yield setUser(req.session, user);
                return res.redirect('/');
            }
            else {
                // failed, back to login
                req.flash('error', 'Wrong e-mail or password.');
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: 'login',
                    errorMsg: req.flash('error').toString(),
                    successMsg: req.flash('success').toString(),
                    oldInput: {
                        email: email
                    },
                    validationErrors: []
                });
            }
        }))
            .catch(err => {
            console.log(err);
            return res.redirect('/login');
        });
    });
};
exports.postLogin = postLogin;
const postLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session !== undefined) {
        yield logout(req.session);
    }
    res.redirect('/');
});
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
        errorMsgs: [],
        oldInput: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });
};
exports.getSignup = getSignup;
const postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    // All validation is being handled in routes/auth
    const validationErrors = express_validator_1.validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: 'signup',
            errorMsgs: validationErrors.array(),
            oldInput: {
                name: name,
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            }
        });
    }
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
        const user = new user_1.User(name, email, hashedPw);
        return user.save();
    })
        .then(() => {
        req.flash('success', 'Success, your account has been created. You can login now.');
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
};
exports.postSignup = postSignup;
const getResetPassword = (req, res, next) => {
    res.render('auth/request-reset-password', {
        pageTitle: 'Reset Password',
        path: 'reset-password',
        errorMsg: req.flash('error').toString()
    });
};
exports.getResetPassword = getResetPassword;
const postResetPassword = (req, res, next) => {
    user_1.User.findByColumn('email', req.body.email).then(user => {
        if (user === undefined) {
            req.flash('error', 'No account with that E-Mail found.');
            return res.redirect('/reset-password');
        }
        crypto_1.default.randomBytes(32, (err, tokenBuffer) => {
            if (err) {
                console.log(err);
                return res.redirect('/reset-password');
            }
            const token = tokenBuffer.toString('hex');
            user.resetToken = token;
            const now = new Date();
            user.resetTokenExpiryDate = new Date(now.setMinutes(now.getMinutes() + 60));
            user
                .save()
                .then(() => {
                res.redirect('/');
                return mailer_1.mailer.send({
                    to: user.email,
                    from: 'shop@NodeShop.dev',
                    subject: 'Password reset link',
                    html: `<p>Click <a href="http://${req.headers.host}${req.url}/${token}">this link</a> to reset your password.</p>
            <p>Please ignore this email if you have not requested this.</p>`
                });
            })
                .catch(err => {
                console.log(err);
            });
        });
    });
};
exports.postResetPassword = postResetPassword;
const getNewPassword = (req, res, next) => {
    const resetToken = req.params.token;
    user_1.User.findByColumn('resettoken', resetToken)
        .then(user => {
        if (user === undefined || user.resetTokenExpiryDate < new Date()) {
            req.flash('error', `The password reset link has expired. <br>
          Please request a new one.`);
            return res.redirect('/reset-password');
        }
        res.render('auth/new-password', {
            pageTitle: 'Reset Password',
            path: 'new-password',
            errorMsg: req.flash('error').toString(),
            userID: user.id,
            resetToken: resetToken
        });
    })
        .catch(err => console.log(err));
};
exports.getNewPassword = getNewPassword;
const postNewPassword = (req, res, next) => {
    const userID = req.body.userID;
    const resetToken = req.body.resetToken;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect(req.headers.referer);
    }
    user_1.User.findByColumn('resettoken', resetToken)
        .then(user => {
        if (user === undefined || user.resetTokenExpiryDate < new Date()) {
            req.flash('error', `The password reset link has expired. <br>
          Please request a new one.`);
            return res.redirect('/reset-password');
        }
        bcrypt
            .hash(password, 12)
            .then(hashedPw => {
            user.hashedPassword = hashedPw;
            user.resetToken = undefined;
            user.resetTokenExpiryDate = undefined;
            return user.save();
        })
            .then(() => {
            req.flash('success', 'Success. You can login with your new password now.');
            res.redirect('/login');
        })
            .catch(err => console.log(err));
    })
        .catch(err => console.log(err));
};
exports.postNewPassword = postNewPassword;
//# sourceMappingURL=auth.js.map