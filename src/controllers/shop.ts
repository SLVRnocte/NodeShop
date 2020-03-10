import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

import pdfDocument from 'pdfkit';

import { DatabaseController as db } from '../controllers/database';
import * as fileStorageController from '../controllers/fileStorage';

import { Product } from '../models/product';
import { Cart } from '../models/cart';
import { Order } from '../models/order';

import { performance } from 'perf_hooks';

// Get the products paged with LIMIT/OFFSET from the database in 1 query
// In case this fails due to out of bounds requestedPage, redo it in 2 queries
const getIndex = (req: Request, res: Response, next: NextFunction) => {
  const itemsPerPage = 2;
  // Get the requested page. If it's <= 0, set to 1
  let requestedPage =
    isNaN(req.query.page) || parseInt(req.query.page) <= 0
      ? 1
      : parseInt(req.query.page);

  // Try to solve in 1 single query, if this fails we redo it with 2 queries
  db.query(
    `SELECT *, count(*) OVER() AS full_count
    FROM   ${Product.tableName}
    LIMIT  ${itemsPerPage}
    OFFSET ${(requestedPage - 1) * itemsPerPage}`
  )
    .then(async result => {
      let totalAmountOfProducts = 0;
      let lastPage = 0;
      let products: Product[] = [];

      // Success
      if (result.rows.length) {
        totalAmountOfProducts = parseInt(result.rows[0].full_count);
        lastPage = Math.ceil(totalAmountOfProducts / itemsPerPage);

        for (const dbProduct of result.rows) {
          products.push(Product.createInstanceFromDB(dbProduct)!);
        }
      }
      // Requested page is out of bounds. Using 2 queries instead which will set requestedPage to lastPage and return safe results
      else {
        await getPagedProductsIn2Queries(itemsPerPage).then(result => {
          totalAmountOfProducts = result.totalAmountOfProducts;
          requestedPage = result.requestedPage;
          lastPage = requestedPage;
          products = result.products;
        });
      }

      res.render('shop/index', {
        products: products,
        currentPage: requestedPage,
        previousPage: requestedPage > 1 ? requestedPage - 1 : NaN,
        nextPage:
          itemsPerPage * requestedPage < totalAmountOfProducts
            ? requestedPage + 1
            : NaN,
        lastPage: lastPage,
        pageTitle: 'Shop',
        path: 'shop'
      });
    })
    .catch(err => console.log(err));
};

const getPagedProductsIn2Queries = async (itemsPerPage: number) => {
  return new Promise<{
    products: Product[];
    totalAmountOfProducts: number;
    requestedPage: number;
  }>(async resolve => {
    await db
      .query(`SELECT COUNT(*) FROM ${Product.tableName}`)
      .then(async result => {
        const totalAmountOfProducts = parseInt(result.rows[0].count);
        // Requested page was out of bounds, so we set it to lastPage directly
        const requestedPage = Math.ceil(totalAmountOfProducts / itemsPerPage);

        await db
          .query(
            `SELECT * FROM ${
              Product.tableName
            } LIMIT ${itemsPerPage} OFFSET ${(requestedPage - 1) *
              itemsPerPage}`
          )
          .then(result => {
            let products: Product[] = [];
            for (const dbProduct of result.rows) {
              products.push(Product.createInstanceFromDB(dbProduct)!);
            }

            resolve({
              products: products,
              totalAmountOfProducts: totalAmountOfProducts,
              requestedPage: requestedPage
            });
          })
          .catch(err => console.log(err));
      });
  });
};

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll()
    .then(result => {
      res.render('shop/product-list', {
        products: result,
        pageTitle: 'All Products',
        path: 'products'
      });
    })
    .catch(err => console.log(err));
};

const getProduct = (req: Request, res: Response, next: NextFunction) => {
  const productID = parseInt(req.params.productID);
  if (isNaN(productID)) {
    return res.redirect('/');
  }
  Product.findByID(productID)
    .then(result => {
      if (result !== undefined) {
        res.render('shop/product-detail', {
          product: result,
          pageTitle: result.title,
          path: 'products'
        });
      } else {
        res.redirect('/');
      }
    })
    .catch(err => console.log(err));
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const session = req.session!;
  const cart = new Cart(session);

  cart
    .load()
    .then(() => {
      cart.getTotalPrice().then(totalPrice => {
        res.render('shop/cart', {
          pageTitle: 'Shopping Cart',
          path: 'cart',
          cartProducts: cart.cartProducts,
          totalPrice: totalPrice.toFixed(2)
        });
      });
    })
    .catch(err => console.log(err));
};

const postCart = (req: Request, res: Response, next: NextFunction) => {
  const productID = parseInt(req.body.productID);
  if (isNaN(productID)) {
    return res.redirect('/cart');
  }
  const cart = new Cart(req.session!);

  cart.load().then(() => {
    cart.addProduct(productID).then(() => {
      res.redirect('/cart');
    });
  });
};

const postCartDeleteItem = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productID = parseInt(req.body.productID);
  if (isNaN(productID)) {
    return res.redirect('/cart');
  }
  const cart = new Cart(req.session!);

  cart.load().then(() => {
    cart.deleteProduct(productID).then(() => {
      res.redirect('/cart');
    });
  });
};

const postCartModifiyItemQuantity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productID = parseInt(req.body.productID);
  if (isNaN(productID)) {
    return res.redirect('/cart');
  }
  const cart = new Cart(req.session!);
  const modifyType = req.body.modifyType;

  cart.load().then(() => {
    const cartProduct = cart.cartProducts.find(
      cartProduct => cartProduct.product.id === productID
    )!;
    const newQuantity =
      cartProduct.quantity + (modifyType === 'increase' ? 1 : -1);

    cartProduct.modifyQuantity(newQuantity).then(() => {
      res.redirect('/cart');
    });
  });
};

const getOrders = (req: Request, res: Response, next: NextFunction) => {
  const userID = req.session!.user.id;
  Order.fetchAllBelongingToUser(userID).then(orders => {
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: 'orders',
      orders: orders
    });
  });
};

const postOrder = (req: Request, res: Response, next: NextFunction) => {
  const cart = new Cart(req.session!);

  cart
    .load()
    .then(async () => {
      const newOrder = new Order(undefined, cart.belongsToUser!.id);
      await newOrder.setup();
      for (const product of cart.cartProducts) {
        for (let i = 0; i < product.quantity; i++) {
          await newOrder.addProduct(product.product.id);
        }
      }

      return newOrder.save().then(() => {
        return cart.delete();
      });
    })
    .then(() => {
      res.redirect('/orders');
    });
};

const getInvoice = (req: Request, res: Response, next: NextFunction) => {
  const orderID = parseInt(req.params.orderID);
  if (isNaN(orderID) || orderID > Number.MAX_SAFE_INTEGER || orderID < 0) {
    return res.redirect('/orders');
  }

  Order.findByColumn('id', orderID)
    .then(async order => {
      const userID = req.session!.user.id;
      if (order?.belongsToUser !== userID) {
        return res.redirect('/orders');
      }

      const invoiceName = `invoice-${orderID}.pdf`;
      const invoicePath = fileStorageController.invoicePath + invoiceName;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      const pdf = new pdfDocument();
      pdf.pipe(fs.createWriteStream(invoicePath));
      pdf.pipe(res);

      pdf
        .fontSize(8)
        .text(
          'This document is strictly for demonstration purposes only and does not represent an actual invoice.',
          {
            align: 'center'
          }
        )
        .moveDown(5);

      pdf
        .fontSize(15)
        .text(`Order (# ${order!.id})`, { align: 'right' })
        .moveDown(1);

      pdf
        .fontSize(36)
        .text('Invoice', {
          underline: true,
          align: 'center'
        })
        .moveDown(2);

      order!.orderProducts.forEach(orderProduct => {
        pdf
          .fontSize(14)
          .text(
            `(${orderProduct.quantity}x) ${
              orderProduct.product.title
            } --- Total: $${(
              orderProduct.quantity * orderProduct.product.price
            ).toFixed(2)}`
          );
      });
      pdf.moveDown(3);
      let totalPrice = 0;
      await order!.getTotalPrice().then(t => (totalPrice = t));
      pdf
        .fontSize(20)
        .text('Grand Total: $' + totalPrice.toFixed(2))
        .moveDown(3);

      pdf
        .fontSize(8)
        .text(
          'This document is strictly for demonstration purposes only and does not represent an actual invoice.',
          {
            align: 'center'
          }
        )
        .moveDown(5);

      pdf.end();

      // const fileStream = fs.createReadStream(invoicePath);
      // fileStream.pipe(res);
    })
    .catch(err => {
      console.log(err);
      return res.redirect('/orders');
    });
};

const getCheckout = (req: Request, res: Response, next: NextFunction) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: 'checkout'
  });
};

export {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteItem,
  postCartModifiyItemQuantity,
  getOrders,
  postOrder,
  getInvoice,
  getCheckout
};
