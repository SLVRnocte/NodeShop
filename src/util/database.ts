import { Pool, QueryResult } from "pg";
import path from "path";

require("dotenv").config({
  path: path.join(path.dirname(process.mainModule!.filename), "../", ".env")
});

// pools will use environment variables
// for connection information
const pool = new Pool();

async function query(query: string, values?: any[]): Promise<QueryResult> {
  return await pool.query(query, values);
}

export { query };
