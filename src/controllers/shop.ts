import { Request, Response, NextFunction } from "express";

import { Product } from "../models/product";

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll(products => {
    res.render("shop/product-list", {
      products: products,
      pageTitle: "All Products",
      path: "products"
    });
  });
};

const getIndex = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll(products => {
    res.render("shop/index", {
      products: products,
      pageTitle: "Shop",
      path: "shop"
    });
  });
};

const getCart = (req: Request, res: Response, next: NextFunction) => {
  res.render("shop/cart", {
    pageTitle: "Shopping Cart",
    path: "cart"
  });
};

const getOrders = (req: Request, res: Response, next: NextFunction) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "orders"
  });
};

const getCheckout = (req: Request, res: Response, next: NextFunction) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "checkout"
  });
};

export { getProducts, getIndex, getCart, getOrders, getCheckout };
