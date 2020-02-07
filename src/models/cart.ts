import { Product } from "./product";
import fs from "fs";
import path from "path";

// https://stackoverflow.com/questions/40349987/how-to-suppress-error-ts2533-object-is-possibly-null-or-undefined
// Using "!" syntax
// Alternatively: (process.mainModule as NodeModule).filename
const cartPath = path.join(
  path.dirname(process.mainModule!.filename),
  "data",
  "cart.json"
);

class Cart {
  private static cartProducts: { ProductID: string; Quantity: number }[] = [];

  static refreshCart(cbDone: () => void) {
    fs.readFile(cartPath, (err, fileContent) => {
      if (!err) {
        this.cartProducts = JSON.parse(fileContent.toString());
      }
      cbDone();
    });
  }

  static getCart(
    cbDone: (cart: { ProductID: string; Quantity: number }[]) => void
  ) {
    this.refreshCart(() => {
      cbDone(this.cartProducts);
    });
    return [];
  }

  static addProduct(productID: string) {
    const cartProductIndex = this.cartProducts.findIndex(
      product => product["ProductID"] === productID
    );
    const cartProduct = this.cartProducts[cartProductIndex];
    if (cartProduct) {
      this.cartProducts[cartProductIndex]["Quantity"] =
        this.cartProducts[cartProductIndex]["Quantity"] + 1;
    } else {
      this.cartProducts.push({ ProductID: productID, Quantity: 1 });
    }

    fs.writeFile(cartPath, JSON.stringify(this.cartProducts), err => {
      if (err) console.log(err);
    });
  }

  static deleteProduct(id: string, cbDone: () => void) {
    const updatedCartProducts = this.cartProducts.filter(
      product => product.ProductID !== id
    );

    fs.writeFile(cartPath, JSON.stringify(updatedCartProducts), err => {
      if (err) {
        console.log(err);
      }
      cbDone();
    });
  }

  static getTotalPrice() {
    let totalPrice = 0;
    this.cartProducts.forEach(cartProduct => {
      Product.findByID(cartProduct["ProductID"])
        .then(product => {
          for (let i = 0; i < cartProduct["Quantity"]; i++) {
            totalPrice += product.rows[0].price;
          }
        })
        .catch(err => console.log(err));
    });
    return totalPrice;
  }
}

export { Cart };
