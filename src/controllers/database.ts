import fs from 'fs';
import { Pool, QueryResult } from 'pg';
import { Product } from '../models/product';
import { User } from '../models/user';
import { Cart } from '../models/cart';
import { CartProduct } from '../models/cartProduct';
import { Order } from '../models/order';
import { OrderProduct } from '../models/orderProduct';

class DatabaseController {
  // pools will use environment variables
  // for connection information
  static pool = new Pool();

  static async init() {
    await User.init(this);
    await Product.init(this);
    await Cart.init(this);
    await CartProduct.init(this);
    await Order.init(this);
    await OrderProduct.init(this);

    // check if session DB table exists, create if not
    await this.query(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'session')"
    ).then(async result => {
      if (!result.rows[0].exists) {
        await this.query(
          fs.readFileSync('node_modules/connect-pg-simple/table.sql').toString()
        );
      }
    });
  }

  static async query(query: string, values?: any[]): Promise<QueryResult> {
    return await this.pool.query(query, values);
  }
}

export { DatabaseController };
