/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Model, Q, Database as WDB } from '@nozbe/watermelondb';
import LocalStorage from '@nozbe/watermelondb/Database/LocalStorage';
import { Clause } from '@nozbe/watermelondb/QueryDescription';
import { DatabaseTable } from '@appTypes';
import { database } from './main';

class Database {
  private db: WDB | undefined;
  private tableName: string | undefined;

  constructor() {
    this.init();
  }

  get localStorage(): LocalStorage {
    if (!this.db) this.init();
    return this.db!.localStorage;
  }

  // DEV ONLY
  private async reset() {
    if (__DEV__) {
      if (!this.db) this.init();
      try {
        await this.db?.write(async () => {
          await this.db?.unsafeResetDatabase();
        });
      } catch (error) {
        // ignore
      }
    }
  }

  private async init() {
    this.db = database;
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
            // assign hash to id in Wallets table
            if (table === DatabaseTable.Wallets) {
              newModel._raw.id = model.hash;
            }
            return newModel;
          });
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async updateModel(table: DatabaseTable, id: string, updateObj: any) {
    if (!this.db) this.init();
    try {
      const model = await this.db!.get(table).find(id);
      return await this.db?.write(async () => {
        return await model.update((modelToUpdate) => {
          for (const key in updateObj) {
            // @ts-ignore
            modelToUpdate[key] = updateObj[key];
          }
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteModel(table: DatabaseTable, id: string) {
    if (!this.db) this.init();
    try {
      const model = await this.db!.get(table).find(id);
      if (model) {
        await this.db?.write(async () => {
          await model.destroyPermanently();
        });
      }
    } catch (error) {
      // ignore
      throw error;
    }
  }

  async deleteMultiple(models: Model[]) {
    if (!this.db) this.init();
    // @ts-ignore
    try {
      await this.db?.write(async () => {
        for (const model of models) {
          await model.destroyPermanently();
        }
      });
    } catch (error) {
      throw error;
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

  async getCount(table: DatabaseTable, ...args: Clause[]) {
    if (!this.db) this.init();
    try {
      return await this.db?.get(table).query(args).fetchCount();
    } catch (error) {
      // TODO ignore
    }
  }

  async unsafeRawQuery(table: DatabaseTable, query: string) {
    return await database.get(table).query(Q.unsafeSqlQuery(query)).fetch();
  }

  async updateRelation<T1 extends Model, T2 extends Model>(
    model1: T1,
    model2: T2,
    key: keyof T1
  ) {
    try {
      if (!this.db) this.init();
      return this.db?.write(async () => {
        try {
          return await model1.update((acc) => {
            // @ts-ignore
            acc[key].id = model2.id;
          });
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new Database();
