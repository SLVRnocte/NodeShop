import { Request, Response, NextFunction } from "express";

import { Product } from "../models/product";

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "add-product"
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

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll(products => {
    res.render("admin/products", {
      products: products,
      pageTitle: "Admin Products",
      path: "admin/products"
    });
  });
};

export { getAddProduct, postAddProduct, getProducts };
