import { Request, Response, NextFunction } from "express";

import { Product } from "../models/product";
import { Cart } from "../models/cart";

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll(products => {
    res.render("shop/product-list", {
      products: products,
      pageTitle: "All Products",
      path: "products"
    });
  });
};

const getProduct = (req: Request, res: Response, next: NextFunction) => {
  const productID = req.params.productID;
  Product.findByID(productID, product => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
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
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts: { product: Product; quantity: Number }[] = [];

      cart.forEach(cartProduct => {
        const product = products.find(
          product => cartProduct.ProductID === product.id
        );
        if (product !== undefined) {
          cartProducts.push({
            product: product,
            quantity: cartProduct.Quantity
          });
        }
      });

      res.render("shop/cart", {
        pageTitle: "Shopping Cart",
        path: "cart",
        products: cartProducts
      });
    });
  });
};

const postCart = (req: Request, res: Response, next: NextFunction) => {
  const productID = req.body.productID;
  Product.findByID(productID, product => {
    Cart.refreshCart(() => {
      Cart.addProduct(productID);
    });
  });
  res.redirect("/cart");
};

const postCartDeleteItem = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productID = req.body.productID;
  Cart.deleteProduct(productID, () => {
    res.redirect("/cart");
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

export {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  postCartDeleteItem,
  getOrders,
  getCheckout
};
