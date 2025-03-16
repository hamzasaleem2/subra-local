import { DatabaseSchema, Document, QueryOptions, Subscriber, TableSchema } from './types';
import { StorageEngine } from './engine';
import { Validator } from './validator';

export class Database {
  private engine: StorageEngine;
  private validators: Map<string, Validator>;

  constructor(schema: DatabaseSchema, prefix: string = 'db_') {
    this.engine = new StorageEngine(prefix, schema);
    this.validators = new Map();

    Object.entries(schema).forEach(([tableName, tableSchema]) => {
      this.validators.set(tableName, new Validator(tableSchema));
    });
  }

  public table<T extends Document>(tableName: string) {
    const validator = this.validators.get(tableName);
    if (!validator) {
      throw new Error(`Table ${tableName} not found`);
    }

    return {
      getAll: () => this.engine.getAll<T>(tableName),
      getById: (id: string) => this.engine.getById<T>(tableName, id),
      query: (options: QueryOptions = {}) => this.engine.query<T>(tableName, options),

      insert: (data: Partial<Omit<T, '_id' | '_createdAt' | '_updatedAt'>>) => {
        const validatedData = validator.applyDefaults(data);
        validator.validate(validatedData);
        return this.engine.insert<T>(tableName, validatedData as Omit<T, '_id' | '_createdAt' | '_updatedAt'>);
      },
      update: (id: string, data: Partial<T>) => {
        validator.validate(data);
        return this.engine.update<T>(tableName, id, data);
      },
      delete: (id: string) => this.engine.delete(tableName, id),
      clear: () => this.engine.clear(tableName),

      subscribe: (subscriber: Subscriber) => this.engine.subscribe(tableName, subscriber),
    };
  }

  public getSchema(tableName: string): TableSchema | undefined {
    const validator = this.validators.get(tableName);
    return validator ? validator.getSchema() : undefined;
  }

  public clearAll(): void {
    this.validators.forEach((_, tableName) => {
      this.engine.clear(tableName);
    });
  }
} 