/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DatabaseTable } from '@appTypes';
import { database } from './main';
import { Q, Database as WDB } from '@nozbe/watermelondb';
import { Clause } from '@nozbe/watermelondb/QueryDescription';
import LocalStorage from '@nozbe/watermelondb/Database/LocalStorage';

class Database {
  private db: WDB | undefined;

  constructor() {
    this.init();
  }

  get localStorage(): LocalStorage {
    if (!this.db) this.init();
    return this.db!.localStorage;
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

  async updateModel(table: DatabaseTable, id: string, updateObj: any) {
    if (!this.db) this.init();
    try {
      const model = await this.db!.get(table).find(id);
      await model.update((modelToUpdate) => {
        for (const key in updateObj) {
          // @ts-ignore
          modelToUpdate[key] = updateObj[key];
        }
      });
    } catch (error) {
      // ignore
    }
  }

  async deleteModel(table: DatabaseTable, id: string) {
    if (!this.db) this.init();
    try {
      const model = await this.db!.get(table).find(id);
      if (model) await model.destroyPermanently();
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
