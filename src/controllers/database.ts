import { Pool, QueryResult, Query } from 'pg';
import path from 'path';
import { Product } from '../models/product';
import { User } from '../models/user';
import { Cart } from '../models/cart';
import { CartProduct } from '../models/cartProduct';

require('dotenv').config({
  path: path.join(path.dirname(process.mainModule!.filename), '../', '.env')
});

class DatabaseController {
  // pools will use environment variables
  // for connection information
  static pool = new Pool();

  static async init() {
    await User.init(this);
    await Product.init(this);
    await Cart.init(this);
    await CartProduct.init(this);
  }

  static async query(query: string, values?: any[]): Promise<QueryResult> {
    return await this.pool.query(query, values);
  }
}

export { DatabaseController };
