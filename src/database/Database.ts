/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DatabaseTable } from '@appTypes';
import { database } from './main';
import { Q, Database as WDB } from '@nozbe/watermelondb';
import { Clause } from '@nozbe/watermelondb/QueryDescription';

class Database {
  private db: WDB | undefined;

  constructor() {
    this.init();
  }

  private async reset() {
    if (!this.db) this.init();
    await this.db?.write(async () => {
      await this.db?.unsafeResetDatabase();
    });
  }

  private async init() {
    this.db = database;
    this.reset();
  }

  getDatabase() {
    if (this.db) return this.db;
    return database;
  }

  async createModel(table: DatabaseTable, model: any) {
    if (!this.db) this.init();
    try {
      return await this.db!.write(async () => {
        try {
          return await this.db!.get(table).create((newModel) => {
            for (const key in model) {
              // @ts-ignore
              newModel[key] = model[key];
            }
            return newModel;
          });
        } catch (error) {
          // ignore
        }
      });
    } catch (error) {
      // ignore
    }
  }

  unEscapeString(goodString: string) {
    if (!goodString) return false;
    return goodString.replace(/quote/g, "'");
  }

  escapeString(badString: string) {
    if (!badString) return false;
    return badString.replace(/[']/g, 'quote');
  }

  async query(table: DatabaseTable, ...args: Clause[]) {
    if (!this.db) this.init();
    try {
      return await this.db?.get(table).query(args).fetch();
    } catch (error) {
      // TODO ignore
    }
  }

  async unsafeRawQuery(table: DatabaseTable, query: string) {
    return await database.get(table).query(Q.unsafeSqlQuery(query)).fetch();
  }
}

export default new Database();
