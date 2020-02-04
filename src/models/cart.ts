import { Product } from "./product";
import fs from "fs";
import path from "path";

// https://stackoverflow.com/questions/40349987/how-to-suppress-error-ts2533-object-is-possibly-null-or-undefined
// Using "!" syntax
// Alternatively: (process.mainModule as NodeModule).filename
const productsPath = path.join(
  path.dirname(process.mainModule!.filename),
  "data",
  "cart.json"
);

class Cart {
  static products: [string, number][] = [];
  static addProduct(productID: string) {
    fs.readFile(productsPath, (err, fileContent) => {
      //   let cart: { products: [string, number][], totalPrice: number } = {
      //     products: [],
      //     totalPrice: 0
      //   };

      if (!err) {
        // cart = JSON.parse(fileContent.toString());
        this.products = JSON.parse(fileContent.toString());
      }

      const cartProductIndex = this.products.findIndex(
        product => product[0] === productID
      );
      const cartProduct = this.products[cartProductIndex];
      if (cartProduct) {
        this.products[cartProductIndex][1] =
          this.products[cartProductIndex][1] + 1;
      } else {
        this.products.push([productID, 1]);
      }

      fs.writeFile(productsPath, JSON.stringify(this.products), err => {
        console.log(err);
      });
    });
  }

  static getTotalPrice() {
    let totalPrice = 0;
    this.products.forEach(product => {
      Product.findByID(product[0], product => {
        totalPrice += product.price;
      });
    });
    return totalPrice;
  }
}

export { Cart };
