import express from 'express';
import { check, body } from 'express-validator';
import validator from 'validator';

import * as authController from '../controllers/auth';
import { User } from '../models/user';

const router = express.Router();

router.get('/login', authController.getLogin);

router.post(
  '/login',
  [
    // Check email
    body('email', 'Please enter a valid e-mail address.')
      .isEmail()
      .normalizeEmail()
      .custom(async value => {
        return User.findByColumn('email', value).then(result => {
          if (!result) {
            return Promise.reject('No user with that email has been found.');
          }
        });
      })
  ],
  authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
  '/signup',
  [
    // Form Validators
    // Check Name
    body(
      'name',
      `Please enter a valid name. <br>
    Valid Characters for your name: (a-z, A-Z).`
    ).custom(name => {
      // Custom validator
      // Name has to be alphanumeric however spaces are allowed
      if (!validator.isAlphanumeric(validator.blacklist(name, ' '))) {
        return false;
      }
      // Reject "guest"
      if (name.toLowerCase() === 'guest') {
        return false;
      }
      return true;
    }),

    // Check email
    check('email', 'Please enter a valid e-mail address.')
      .isEmail()
      .normalizeEmail()
      .custom(async value => {
        return User.findByColumn('email', value).then(result => {
          if (result) {
            return Promise.reject('A user with that E-Mail already exists.');
          }
        });
      }),

    // Check password
    check(
      'password',
      'Please enter a valid password with at least 5 characters.'
    ).isLength({ min: 5, max: 128 }),

    // Check confirm password
    body('confirmPassword').custom((confirmPassword, { req }) => {
      // confirmPassword == '' is redundant however its here to flash the field if all
      // fields are empty and the form is being submitted
      if (confirmPassword !== req.body.password || confirmPassword == '') {
        throw new Error('Passwords do not match.');
      }
      return true;
    })
  ],
  authController.postSignup
);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

router.get('/reset-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

export default router;
