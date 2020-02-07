import { Request, Response, NextFunction } from "express";

import { Product } from "../models/product";

import { Cart } from "../models/cart";

import * as db from "../util/database";

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "admin/add-product"
  });
};

const postAddProduct = (req: Request, res: Response, next: NextFunction) => {
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(title, imageURL, description, price);
  product
    .save()
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
};

const getEditProduct = (req: Request, res: Response, next: NextFunction) => {
  if (req.query.edit !== "true") {
    return res.redirect("/");
  }

  const productID = req.params.productID;
  Product.findByID(productID)
    .then(product => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "admin/edit-product",
        product: product.rows[0]
      });
    })
    .catch(err => console.log(err));
};

const postEditProduct = (req: Request, res: Response, next: NextFunction) => {
  const productID = req.body.productID;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageURL = req.body.imageURL;
  const updatedDescription = req.body.description;
  const updatedProduct = new Product(
    updatedTitle,
    updatedImageURL,
    updatedDescription,
    updatedPrice,
    productID
  );
  updatedProduct
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

const postDeleteProduct = (req: Request, res: Response, next: NextFunction) => {
  const productID = req.body.productID;
  Cart.refreshCart(() => {
    Cart.deleteProduct(productID, () => {
      Product.deleteByID(productID)
        .then(() => {
          res.redirect("/admin/products");
        })
        .catch(err => console.log(err));
    });
  });
};

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll()
    .then(products => {
      res.render("admin/products", {
        products: products.rows,
        pageTitle: "Admin Products",
        path: "admin/products"
      });
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
