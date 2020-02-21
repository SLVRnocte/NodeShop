import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';

const setUser = (session: Express.Session, user: User): Promise<void> => {
  session.user = user;
  return new Promise<void>(resolve => {
    session.save(err => {
      if (err) console.log(err);

      resolve();
    });
  });
};

const getLogin = (req: Request, res: Response, next: NextFunction) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: 'login',
    isLoggedIn: req.session!.isLoggedIn
  });
};

const postLogin = (req: Request, res: Response, next: NextFunction) => {
  // Fake login with dummy user
  User.findByID(1)
    .then(async user => {
      // Dummy doesn't exist, create
      if (!user) {
        user = new User('Test User', 'Test@testerino.com');
        await user.save();
      }

      req.session!.isLoggedIn = true;
      await setUser(req.session!, user);
    })
    .catch(err => console.log(err));

  res.redirect('/');
};

const postLogout = (req: Request, res: Response, next: NextFunction) => {
  req.session?.destroy(err => {
    if (err) console.log(err);

    res.redirect('/');
  });
};

export { setUser, getLogin, postLogin, postLogout };
