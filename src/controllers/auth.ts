import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';

import { User } from '../models/user';
import { DatabaseController as db } from '../controllers/database';
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
    errorMsg: req.flash('error').toString()
  });
};

const postLogin = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(`SELECT * FROM users WHERE email=$1`, [email]).then(r => {
    if (r.rows[0] === undefined) {
      req.flash('error', 'Invalid E-Mail.');
      return res.redirect('/login');
    }

    bcrypt
      .compare(password, r.rows[0].password)
      .then(match => {
        if (match) {
          User.findByID(r.rows[0].id)
            .then(async user => {
              await setUser(req.session!, user);
              return res.redirect('/');
            })
            .catch(err => console.log(err));
        } else {
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

const postLogout = (req: Request, res: Response, next: NextFunction) => {
  if (req.session !== undefined) {
    logout(req.session);
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
    errorMsg: req.flash('error').toString()
  });
};

const postSignup = (req: Request, res: Response, next: NextFunction) => {
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

  db.query(`SELECT EXISTS(select from users where email=$1)`, [email]).then(
    result => {
      if (result.rows[0].exists) {
        req.flash('error', 'A user with that E-Mail already exists.');
        return res.redirect('/signup');
      }

      bcrypt
        .hash(password, 12)
        .then(hashedPw => {
          const user = new User(name, email, hashedPw);
          return user.save();
        })
        .then(() => {
          res.redirect('/login');
          return mailer.sendMail({
            to: email,
            from: 'shop@NodeShop.dev',
            subject: 'Signup succeeded!',
            html: `<h1>Thank you for signing up in my NodeShop project, ${name}!</h1>
            <p>You can start using the shop right away!</p>
            <p>In case you have any questions you can reach me on GitHub: <a href="https://github.com/SLVRnocte/">https://github.com/SLVRnocte/</a></p>`
          });
        })
        .catch(err => console.log(err));
    }
  );
};

export { setUser, getLogin, postLogin, postLogout, getSignup, postSignup };
