import path from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import { Request, Response, NextFunction } from 'express';
const pgSession = require('connect-pg-simple')(session);
import csurf from 'csurf';
import flash from 'connect-flash';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';

import * as errorController from './controllers/error';
import { DatabaseController as db } from './controllers/database';
import { init as mailerInit } from './controllers/mailer';
import { User } from './models/user';
import { setUser } from './controllers/auth';

// Init dotenv
dotenv.config({
  path: path.join(path.dirname(process.mainModule!.filename), '../', '.env')
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    store: new pgSession({
      pool: db.pool
    }),
    secret: process.env.SESSIONSECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
  })
);

// Every browser will be a guest by default, the guest gets deleted
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (req.session!.user === undefined) {
    await User.createGuest().then(async guest => {
      await setUser(req.session!, guest);
    });
  }

  next();
});

app.use(csurf());
app.use(flash());

// Set a new csrfToken for every single request.
// The csrfToken only gets checked on every POST request through the views
// such as on navigation.ejs (logout button), add-to-cart.ejs and so on.
app.use((req: Request, res: Response, next: NextFunction) => {
  (res.locals.isLoggedIn = req.session!.isLoggedIn),
    (res.locals.csrfToken = req.csrfToken()),
    next();
});

app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/', errorController.get404);

mailerInit();
db.init()
  .then(() => {
    app.listen(3000, () => console.log('Node server listening!'));
  })
  .catch(err => console.log(err));
