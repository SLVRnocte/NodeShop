import * as db from "../util/database";
import { QueryResult } from "pg";

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
    price: number,
    id?: string
  ) {
    this.id = id !== undefined ? id : "";
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save(): Promise<QueryResult> {
    return db.query(
      'INSERT INTO Products ("title", "price", "description", "imageURL") VALUES ($1, $2, $3, $4)',
      [this.title, this.price, this.description, this.imageURL]
    );
  }

  static deleteByID(id: string): Promise<QueryResult> {
    return db.query("DELETE FROM Products WHERE id=$1", [id]);
  }

  static fetchAll(): Promise<QueryResult> {
    return db.query("SELECT * FROM Products");
  }

  static findByID(id: string): Promise<QueryResult> {
    return db.query("SELECT * FROM Products WHERE id=$1", [id]);
  }
}

export { Product };
