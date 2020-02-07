import { Request, Response, NextFunction } from "express";

import { Product } from "../models/product";
import { Cart } from "../models/cart";

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll()
    .then(result => {
      res.render("shop/product-list", {
        products: result.rows,
        pageTitle: "All Products",
        path: "products"
      });
    })
    .catch(err => console.log(err));
};

const getProduct = (req: Request, res: Response, next: NextFunction) => {
  const productID = req.params.productID;
  Product.findByID(productID)
    .then(result => {
      res.render("shop/product-detail", {
        product: result.rows[0],
        pageTitle: result.rows[0].title,
        path: "products"
      });
    })
    .catch(err => console.log(err));
};

const getIndex = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll()
    .then(result => {
      res.render("shop/index", {
        products: result.rows,
        pageTitle: "Shop",
        path: "shop"
      });
    })
    .catch(err => console.log(err));
};

const getCart = (req: Request, res: Response, next: NextFunction) => {
  Cart.getCart(cart => {
    Product.fetchAll()
      .then(result => {
        const products: Product[] = result.rows;
        //console.log(products.find(product => 1 === parseInt(product.id)));
        const cartProducts: { product: Product; quantity: Number }[] = [];

        cart.forEach(cartProduct => {
          const product = products.find(
            product => cartProduct.ProductID === product.id.toString()
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
      })
      .catch(err => console.log(err));
  });
};

const postCart = (req: Request, res: Response, next: NextFunction) => {
  const productID = req.body.productID;

  Cart.refreshCart(() => {
    Cart.addProduct(productID);
    res.redirect("/cart");
  });
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
