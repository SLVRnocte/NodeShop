import fs from "fs";
import path from "path";
import { DESTRUCTION } from "dns";

// https://stackoverflow.com/questions/40349987/how-to-suppress-error-ts2533-object-is-possibly-null-or-undefined
// Using "!" syntax
// Alternatively: (process.mainModule as NodeModule).filename
const productsPath = path.join(
  path.dirname(process.mainModule!.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb: (products: Product[]) => void) => {
  fs.readFile(productsPath, (err, fileContent) => {
    if (err) {
      return cb([]);
    } else {
      return cb(JSON.parse(fileContent.toString()));
    }
  });
};

class Product {
  title: string;
  imageURL: string;
  description: string;
  price: number;

  constructor(
    title: string,
    imageURL: string,
    description: string,
    price: number
  ) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(productsPath, JSON.stringify(products), err => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static fetchAll(cb: (products: Product[]) => void) {
    getProductsFromFile(cb);
  }
}

export { Product };
