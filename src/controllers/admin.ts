import { Request, Response, NextFunction } from "express";

import { Product } from "../models/product";

import { Cart } from "../models/cart";

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
  product.save();
  res.redirect("/");
};

const getEditProduct = (req: Request, res: Response, next: NextFunction) => {
  if (req.query.edit !== "true") {
    return res.redirect("/");
  }

  const productID = req.params.productID;
  Product.findByID(productID, product => {
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "admin/edit-product",
      product: product
    });
  });
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
  updatedProduct.save();
  res.redirect("/admin/products");
};

const postDeleteProduct = (req: Request, res: Response, next: NextFunction) => {
  const productID = req.body.productID;
  Cart.refreshCart(() => {
    Cart.deleteProduct(productID, () => {
      Product.deleteByID(productID, () => {
        res.redirect("/admin/products");
      });
    });
  });
};

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll(products => {
    res.render("admin/products", {
      products: products,
      pageTitle: "Admin Products",
      path: "admin/products"
    });
  });
};

export {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
  getProducts
};
