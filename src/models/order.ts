import { staticImplements } from '../util/staticImplements';
import {
  IDatabaseModel,
  IDatabaseModelStatic
} from '../interfaces/IDatabaseModel';

import { DatabaseController as db } from '../controllers/database';
import { QueryResult } from 'pg';

import { User } from './user';
import { OrderProduct } from './orderProduct';

//@staticImplements<IDatabaseModelStatic>()
class Order implements IDatabaseModel {
  id: number = NaN;
  belongsToUser: number = NaN;
  orderProducts: OrderProduct[] = [];

  static tableName = 'Orders';

  static async init(databaseController: db): Promise<QueryResult> {
    return db.query(
      `CREATE TABLE IF NOT EXISTS ${Order.tableName}(
          id INT NOT NULL UNIQUE GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
          updatedAt TIMESTAMPTZ NOT NULL,
          orderedAt TIMESTAMPTZ NOT NULL,
          belongsToUser INT NOT NULL REFERENCES ${User.tableName}(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`
    );
  }

  constructor(id?: number, belongsToUser?: number) {
    if (
      (belongsToUser === undefined || isNaN(belongsToUser)) &&
      (id === undefined || isNaN(id))
    ) {
      console.error('either assign id or belongsToUser!');
    }

    this.id = id !== undefined && !isNaN(id) ? id : NaN;
    this.belongsToUser =
      belongsToUser !== undefined && !isNaN(belongsToUser)
        ? belongsToUser
        : NaN;

    // Remember to call setup()
  }

  async setup() {
    if (!isNaN(this.id)) {
      return this.load();
    } else {
      return this.save();
    }
  }

  async save(): Promise<QueryResult> {
    const now = new Date();
    if (isNaN(this.id)) {
      return new Promise<QueryResult<any>>(res => {
        db.query(
          `INSERT INTO ${Order.tableName} (updatedAt, orderedAt, belongsToUser) VALUES ($1, $1, $2) RETURNING *`,
          [now, this.belongsToUser]
        ).then(result => {
          this.id = result.rows[0].id;
          res(result);
        });
      });
    } else {
      return db.query(
        `UPDATE ${Order.tableName} SET updatedAt=$1 WHERE id=$2`,
        [now, this.id]
      );
    }
  }

  delete(): Promise<QueryResult> {
    return db.query(`DELETE FROM ${Order.tableName} WHERE id=$1`, [this.id]);
  }

  private load(): Promise<void> {
    return new Promise<void>(resolve => {
      db.query(`SELECT * FROM ${Order.tableName} WHERE id=$1`, [this.id])
        .then(result => {
          // This user has no cart yet
          if (result.rowCount === 0) {
            console.error(`Order with id(${this.id}) not found!`);
          } else {
            this.id = result.rows[0].id;

            // get all orderItems with this id, populate array
            OrderProduct.fetchAllBelongingToOrder(this.id).then(result => {
              this.orderProducts = result;

              resolve();
            });
          }
        })
        .catch(err => console.log(err));
    });
  }

  async addProduct(productID: number): Promise<void> {
    const cartProductIndex = this.orderProducts.findIndex(
      cartProduct => cartProduct.product.id === productID
    );
    let orderProduct = this.orderProducts[cartProductIndex];
    if (orderProduct) {
      orderProduct.quantity++;
    } else {
      orderProduct = new OrderProduct(this.id, 1);
      await orderProduct.setup(productID);
      this.orderProducts.push(orderProduct);
    }

    await orderProduct.save();

    return new Promise<void>(async resolve => {
      await this.save();
      resolve();
    });
  }

  async deleteProduct(productID: number): Promise<void> {
    const cartProductIndex = this.orderProducts.findIndex(
      cartProduct => cartProduct.product.id === productID
    );
    let cartProduct = this.orderProducts[cartProductIndex];
    console.log(cartProduct);
    await cartProduct.delete();

    this.orderProducts.splice(cartProductIndex, 1);

    return new Promise<void>(async resolve => {
      await this.save();
      resolve();
    });
  }

  getTotalPrice(): Promise<number> {
    return new Promise<number>(resolve => {
      let totalPrice = 0;
      for (const cartProduct of this.orderProducts) {
        for (let i = 0; i < cartProduct.quantity; i++) {
          totalPrice += cartProduct.product.price;
        }
      }

      resolve(totalPrice);
    });
  }

  static findByColumn(
    column: string,
    value: any,
    caseInsensitive?: boolean
  ): Promise<Order | undefined> {
    const query = caseInsensitive
      ? `SELECT * FROM ${Order.tableName} WHERE LOWER(${column})=$1`
      : `SELECT * FROM ${Order.tableName} WHERE ${column}=$1`;

    return new Promise<any>(resolve => {
      db.query(query, [value])
        .then(result => {
          resolve(this.createInstanceFromDB(result.rows[0]));
        })
        .catch(err => console.log(err));
    });
  }

  static fetchAllBelongingToUser(userID: number): Promise<Order[]> {
    return new Promise<Order[]>(resolve => {
      db.query(`SELECT * FROM ${Order.tableName} WHERE belongsToUser=$1`, [
        userID
      ])
        .then(async result => {
          const orders: Order[] = [];
          for (const row of result.rows) {
            await this.createInstanceFromDB(row).then(result => {
              orders.push(result!);
            });
          }
          resolve(orders);
        })
        .catch(err => console.log(err));
    });
  }

  private static async createInstanceFromDB(
    dbProduct: any
  ): Promise<Order | undefined> {
    if (dbProduct === undefined) {
      return undefined;
    }

    const order = new Order(dbProduct.id, dbProduct.belongstouser);

    await order.load();
    return order;
  }
}

export { Order };
