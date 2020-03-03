import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

import { User } from '../models/user';
import { mailer } from '../controllers/mailer';

const setUser = async (session: Express.Session, user: User): Promise<void> => {
  session.user = user;
  session.isLoggedIn =
    session.user.name.toLowerCase() === 'guest' ? false : true;

  return new Promise<void>(resolve => {
    session.save(err => {
      if (err) {
        console.log(err);
      }

      resolve();
    });
  });
};

const getLogin = (req: Request, res: Response, next: NextFunction) => {
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

const postLogin = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;

  // All validation is being handled in routes/auth
  const validationErrors = validationResult(req);
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
  User.findByColumn('email', email).then(user => {
    bcrypt
      .compare(password, user!.hashedPassword)
      .then(async match => {
        if (match) {
          await setUser(req.session!, user!);

          return res.redirect('/');
        } else {
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
      })
      .catch(err => {
        console.log(err);
        return res.redirect('/login');
      });
  });
};

const postLogout = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session !== undefined) {
    await logout(req.session);
  }

  res.redirect('/');
};

const logout = (session: Express.Session): Promise<void> => {
  return new Promise<void>(resolve => {
    session.destroy(err => {
      if (err) console.log(err);

      resolve();
    });
  });
};

const getSignup = (req: Request, res: Response, next: NextFunction) => {
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

const postSignup = (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // All validation is being handled in routes/auth
  const validationErrors = validationResult(req);
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
      const user = new User(name, email, hashedPw);
      return user.save();
    })
    .then(() => {
      req.flash(
        'success',
        'Success, your account has been created. You can login now.'
      );
      res.redirect('/login');
      return mailer.send({
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

const getResetPassword = (req: Request, res: Response, next: NextFunction) => {
  res.render('auth/request-reset-password', {
    pageTitle: 'Reset Password',
    path: 'reset-password',
    errorMsg: req.flash('error').toString()
  });
};

const postResetPassword = (req: Request, res: Response, next: NextFunction) => {
  User.findByColumn('email', req.body.email).then(user => {
    if (user === undefined) {
      req.flash('error', 'No account with that E-Mail found.');
      return res.redirect('/reset-password');
    }

    crypto.randomBytes(32, (err, tokenBuffer) => {
      if (err) {
        console.log(err);
        return res.redirect('/reset-password');
      }

      const token = tokenBuffer.toString('hex');
      user.resetToken = token;
      const now = new Date();
      user.resetTokenExpiryDate = new Date(
        now.setMinutes(now.getMinutes() + 60)
      );
      user
        .save()
        .then(() => {
          res.redirect('/');
          return mailer.send({
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

const getNewPassword = (req: Request, res: Response, next: NextFunction) => {
  const resetToken = req.params.token;

  User.findByColumn('resettoken', resetToken)
    .then(user => {
      if (user === undefined || user.resetTokenExpiryDate! < new Date()) {
        req.flash(
          'error',
          `The password reset link has expired. <br>
          Please request a new one.`
        );

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

const postNewPassword = (req: Request, res: Response, next: NextFunction) => {
  const userID = req.body.userID;
  const resetToken = req.body.resetToken;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match.');

    return res.redirect(req.headers.referer!);
  }

  User.findByColumn('resettoken', resetToken)
    .then(user => {
      if (user === undefined || user.resetTokenExpiryDate! < new Date()) {
        req.flash(
          'error',
          `The password reset link has expired. <br>
          Please request a new one.`
        );

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
          req.flash(
            'success',
            'Success. You can login with your new password now.'
          );
          res.redirect('/login');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

export {
  setUser,
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword
};
