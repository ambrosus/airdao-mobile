import { database } from './main';
import { Database as WDB } from '@nozbe/watermelondb';
class Database {
  db: WDB | undefined;

  constructor() {
    this.init();
  }

  private init() {
    this.db = database;
  }

  getDatabase() {
    if (this.db) return this.db;
    return database;
  }
}

export default new Database();
