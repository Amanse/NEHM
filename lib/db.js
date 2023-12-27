import sqlite3 from "sqlite3";
import { open } from "sqlite";

const name =
  process.env.NODE_ENV == "production" ? "./prod.db" : "./database.db";

const db = open({
  filename: name,
  driver: sqlite3.Database,
});
// you would have to import / invoke this in another file
export default db;
