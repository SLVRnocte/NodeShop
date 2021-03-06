import path from 'path';

import { QueryResult } from 'pg';

import { staticImplements } from '../util/staticImplements';
import {
  IDatabaseModel,
  IDatabaseModelStatic
} from '../interfaces/IDatabaseModel';

import * as fileStorageController from '../controllers/fileStorage';
import { DatabaseController as db } from '../controllers/database';

import { User } from './user';

@staticImplements<IDatabaseModelStatic>()
class Product implements IDatabaseModel {
  id: number;
  title: string;
  private imageDBURL: string;
  imageURL: string;
  imagePath: string;
  description: string;
  price: number;
  createdByUser: number;

  static tableName = 'Products';

  constructor(
    title: string,
    imageURL: string,
    description: string,
    price: number,
    id?: number,
    createdByUser?: number
  ) {
    this.id = id !== undefined ? id : NaN;
    this.createdByUser = createdByUser !== undefined ? createdByUser : NaN;
    this.title = title;
    this.imageDBURL = imageURL;
    this.imageURL = path.join('/', 'images', this.imageDBURL);
    this.imagePath = path.join(
      fileStorageController.imagePath,
      this.imageDBURL
    );
    this.description = description;
    this.price = price;
  }

  static init(databaseController: db): Promise<QueryResult> | undefined {
    if (databaseController === undefined) {
      return undefined;
    }

    return db.query(
      `CREATE TABLE IF NOT EXISTS ${Product.tableName}(
      id INT NOT NULL UNIQUE GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      description TEXT NOT NULL,
      imageURL VARCHAR(255) NOT NULL,
      updatedAt TIMESTAMPTZ NOT NULL,
      createdAt TIMESTAMPTZ NOT NULL,
      createdByUser INT NOT NULL REFERENCES ${User.tableName}(id) ON DELETE CASCADE ON UPDATE CASCADE
    )`
    );
  }

  async save(): Promise<QueryResult> {
    // Does the product exist in the app
    let result = !isNaN(this.id);

    // Even if so, does it for some reason not exist in the DB?
    // Maybe someone manually inserted a faulty ID into the URL
    if (result) {
      await db
        .query(
          `SELECT EXISTS(select 1 from ${Product.tableName} where id=$1)`,
          [this.id]
        )
        .then(res => {
          result = res.rows[0].exists;
        });
    }

    const now = new Date();
    if (!result) {
      return new Promise<QueryResult<any>>(res => {
        db.query(
          `INSERT INTO ${Product.tableName} (title, price, description, imageURL, updatedAt, createdAt, createdByUser) VALUES ($1, $2, $3, $4, $5, $5, $6) RETURNING *`,
          [
            this.title,
            this.price,
            this.description,
            this.imageDBURL,
            now,
            this.createdByUser
          ]
        ).then(result => {
          this.id = result.rows[0].id;
          res(result);
        });
      });
    } else {
      return db.query(
        `UPDATE ${Product.tableName} SET title=$1, price=$2, description=$3, imageURL=$4, updatedAt=$5 WHERE id=$6`,
        [
          this.title,
          this.price,
          this.description,
          this.imageDBURL,
          now,
          this.id
        ]
      );
    }
  }

  delete(): Promise<QueryResult> {
    return db.query(`DELETE FROM ${Product.tableName} WHERE id=$1`, [this.id]);
  }

  static fetchAll(): Promise<Product[]> {
    return new Promise<Product[]>(resolve => {
      db.query(`SELECT * FROM ${Product.tableName}`)
        .then(result => {
          let products: Product[] = [];
          for (const row of result.rows) {
            products.push(this.createInstanceFromDB(row)!);
          }
          resolve(products);
        })
        .catch(err => console.log(err));
    });
  }

  static findByColumn(column: string, value: any): Promise<Product> {
    return new Promise<any>(resolve => {
      db.query(`SELECT * FROM ${Product.tableName} WHERE ${column}=$1`, [value])
        .then(result => {
          resolve(this.createInstanceFromDB(result.rows[0]));
        })
        .catch(err => console.log(err));
    });
  }

  // Convenience
  static findByID(id: number): Promise<Product> {
    return this.findByColumn('id', id);
  }

  static findByUser(user: User): Promise<Product[]> {
    return new Promise<any>(resolve => {
      db.query(`SELECT * FROM ${Product.tableName} WHERE createdByUser=$1`, [
        user.id
      ])
        .then(result => {
          resolve(this.createInstanceFromDB(result.rows[0]));
        })
        .catch(err => console.log(err));
    });
  }

  static createInstanceFromDB(dbProduct: any): Product | undefined {
    if (dbProduct === undefined) {
      return undefined;
    }

    return new Product(
      dbProduct.title,
      dbProduct.imageurl,
      dbProduct.description,
      dbProduct.price,
      dbProduct.id,
      dbProduct.createdbyuser
    );
  }
}

export { Product };
