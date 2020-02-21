import path from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
const pgSession = require('connect-pg-simple')(session);

import { Request, Response, NextFunction } from 'express';

import * as errorController from './controllers/error';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';

import {
  DatabaseController as db,
  DatabaseController
} from './controllers/database';
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
      pool: DatabaseController.pool
    }),
    secret: process.env.SESSIONSECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
  })
);

// Session does not store literal User object
// Recreate it and set the current user in the app
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (req.session!.user !== undefined) {
    await User.findByID(req.session!.user.id)
      .then(async user => {
        await setUser(req.session!, user);
      })
      .catch(err => console.log(err));
  }

  next();
});

app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/', errorController.get404);

db.init()
  .then(() => {
    app.listen(3000, () => console.log('Node server listening!'));
  })
  .catch(err => console.log(err));
