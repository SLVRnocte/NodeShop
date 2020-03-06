import path from 'path';

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { deleteFile } from '../util/fileHelper';

import { Product } from '../models/product';

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: 'admin/add-product'
  });
};

const postAddProduct = (req: Request, res: Response, next: NextFunction) => {
  const title: string = req.body.title;
  const image: Express.Multer.File = req.file;
  const price: number = req.body.price;
  const description: string = req.body.description;
  const createdBy = req.session!.user.id;

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty() || image === undefined) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: 'admin/add-product',
      errorMsg: image
        ? validationErrors.array()[0].msg
        : 'Attached file is not an image',
      successMsg: req.flash('success').toString(),
      product: {
        title: title,
        //image: image ? image : undefined,
        price: price,
        description: description
      }
    });
  }

  const product = new Product(
    title,
    image.filename,
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
  const userID = req.session!.user.id;
  Product.fetchAll()
    .then(products => {
      products = products.filter(p => p.createdByUser === userID);
      res.render('admin/products', {
        products: products,
        pageTitle: 'Admin Products',
        path: 'admin/products'
      });
    })
    .catch(err => console.log(err));
};

const getEditProduct = (req: Request, res: Response, next: NextFunction) => {
  if (req.query.edit !== 'true') {
    return res.redirect('/');
  }

  const productID = parseInt(req.params.productID);
  if (isNaN(productID)) {
    return res.redirect('/admin/products');
  }

  const userID = req.session!.user.id;
  Product.findByID(productID)
    .then(product => {
      if (product === undefined || product.createdByUser !== userID) {
        return res.redirect('/admin/products');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: 'admin/edit-product',
        product: product
      });
    })
    .catch(err => console.log(err));
};

const postEditProduct = (req: Request, res: Response, next: NextFunction) => {
  const productID = parseInt(req.body.productID);
  if (isNaN(productID)) {
    return res.redirect('/admin/products');
  }
  const userID = req.session!.user.id;
  Product.findByID(productID)
    .then(product => {
      if (product === undefined || product.createdByUser !== userID) {
        return res.redirect('/admin/products');
      }

      const image = req.file;
      if (image) {
        deleteFile(product.imagePath);
        product.imageURL = image.filename;
      }
      product.title = req.body.title;
      product.price = req.body.price;
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
  const productID = req.body.productID;
  const userID = req.session!.user.id;

  Product.findByID(productID)
    .then(async product => {
      if (product === undefined || product.createdByUser !== userID) {
        return res.redirect('/admin/products');
      }

      deleteFile(product.imagePath);
      await product.delete();
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
