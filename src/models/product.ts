import fs from "fs";
import path from "path";
import crypto from "crypto";

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
  id: string;

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
    this.id = crypto.randomBytes(16).toString("hex");
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

  static findByID(id: string, cb: (products: Product) => void) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      if (product !== undefined) {
        cb(product);
      } else {
        throw console.error(`Product with ID ${id} not found!`);
      }
    });
  }
}

export { Product };
