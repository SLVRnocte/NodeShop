import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import * as errorController from './controllers/error';

import { routes as adminRoutes } from './routes/admin';
import shopRoutes from './routes/shop';

import { DatabaseController as db } from './controllers/database';
import { User } from './models/user';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByID(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use(adminRoutes);
app.use(shopRoutes);

app.use('/', errorController.get404);

db.init()
  .then(() => {
    return User.findByID(1);
  })
  .then(user => {
    if (!user) {
      user = new User('Test User', 'Test@testerino.com');
      return user.save();
    }
  })
  .then(() => {
    app.listen(3000, () => console.log('Node server listening!'));
  })
  .catch(err => console.log(err));
