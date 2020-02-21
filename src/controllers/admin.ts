import { Request, Response, NextFunction } from 'express';

import { Product } from '../models/product';

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session!.isLoggedIn) {
    return res.redirect('/');
  }

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: 'admin/add-product',
    isLoggedIn: req.session!.isLoggedIn
  });
};

const postAddProduct = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session!.isLoggedIn) {
    return res.redirect('/');
  }

  const title: string = req.body.title;
  const imageURL: string = req.body.imageURL;
  const description: string = req.body.description;
  const price: number = req.body.price;
  const createdBy = req.session!.user.id;
  const product = new Product(
    title,
    imageURL,
    description,
    price,
    undefined,
    createdBy
  );
  product
    .save()
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
};

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session!.isLoggedIn) {
    return res.redirect('/');
  }

  const userID = req.session!.user.id;
  Product.fetchAll()
    .then(products => {
      products = products.filter(p => p.createdByUser === userID);
      res.render('admin/products', {
        products: products,
        pageTitle: 'Admin Products',
        path: 'admin/products',
        isLoggedIn: req.session!.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

const getEditProduct = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session!.isLoggedIn || req.query.edit !== 'true') {
    return res.redirect('/');
  }

  const productID = parseInt(req.params.productID);
  const userID = req.session!.user.id;
  Product.findByID(productID)
    .then(product => {
      if (product === undefined || product.createdByUser !== userID) {
        return res.redirect('/admin/products');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: 'admin/edit-product',
        product: product,
        isLoggedIn: req.session!.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

const postEditProduct = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session!.isLoggedIn) {
    return res.redirect('/');
  }

  const productID = parseInt(req.body.productID);
  const userID = req.session!.user.id;
  Product.findByID(productID)
    .then(product => {
      if (product === undefined || product.createdByUser !== userID) {
        return res.redirect('/admin/products');
      }

      product.title = req.body.title;
      product.price = req.body.price;
      product.imageURL = req.body.imageURL;
      product.description = req.body.description;
      product
        .save()
        .then(() => {
          res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

const postDeleteProduct = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session!.isLoggedIn) {
    return res.redirect('/');
  }

  const productID = req.body.productID;
  const userID = req.session!.user.id;

  Product.findByID(productID)
    .then(async product => {
      if (product !== undefined && product.createdByUser === userID) {
        await product.delete();
      }
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

export {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
  getProducts
};
