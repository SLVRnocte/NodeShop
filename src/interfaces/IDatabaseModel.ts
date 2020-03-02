import { DatabaseController as db } from '../controllers/database';
import { QueryResult } from 'pg';

interface IDatabaseModel {
  save(): Promise<QueryResult>;
  delete(): Promise<QueryResult>;
}

interface IDatabaseModelStatic {
  tableName: string;
  init(databaseController: db): Promise<QueryResult> | undefined;
  fetchAll(): Promise<any[]>;
  findByColumn(column: string, value: any): Promise<any | undefined>;
  createInstanceFromDB(dbProduct: any): any | undefined;
}

export { IDatabaseModel, IDatabaseModelStatic };
