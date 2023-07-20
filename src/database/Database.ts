/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DatabaseTable } from '@appTypes';
import { database } from './main';
import { Database as WDB } from '@nozbe/watermelondb';

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
}

export default new Database();
