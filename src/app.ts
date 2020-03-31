import path from 'path';
import fs, { access } from 'fs';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import multer, { FileFilterCallback } from 'multer';
import express from 'express';
import session from 'express-session';
import { Request, Response, NextFunction } from 'express';
const pgSession = require('connect-pg-simple')(session);
import csurf from 'csurf';
import flash from 'connect-flash';
import { v4 as uuid } from 'uuid';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';

import * as errorController from './controllers/error';
import * as fileStorageController from './controllers/fileStorage';
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

app.use(helmet());
app.use(compression());
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileStorageController.imagePath);
  },
  filename: (req, file, cb) => {
    //const split = file.originalname.split('.');
    //cb(null, `${uuid()}.${split[split.length - 1]}`);
    cb(
      null,
      `${uuid()}${file.originalname.substr(file.originalname.lastIndexOf('.'))}`
    );
  }
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'data', 'images')));
//app.use(express.static(path.join(__dirname, 'data', 'images')));

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

// Every browser will be a guest by default, the guest gets deleted eventually (TODO)
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

// app.get('/500', errorController.get500);

app.use('/', errorController.get404);

fileStorageController.init();
mailerInit();
db.init()
  .then(() => {
    app.listen(process.env.PORT || 3000, () =>
      console.log('Node server listening!')
    );
  })
  .catch(err => console.log(err));
