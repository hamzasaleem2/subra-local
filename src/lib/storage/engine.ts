import { Document, StorageError, DatabaseSchema, QueryOptions, QueryCondition, Subscriber, StorageEvent } from './types';

export class StorageEngine {
  private prefix: string;
  private schema: DatabaseSchema;
  private subscribers: Map<string, Set<Subscriber>>;

  constructor(prefix: string = 'db_', schema: DatabaseSchema) {
    this.prefix = prefix;
    this.schema = schema;
    this.subscribers = new Map();
    this.initializeTables();
  }

  private initializeTables(): void {
    Object.keys(this.schema).forEach(tableName => {
      const key = this.getTableKey(tableName);
      if (!localStorage.getItem(key)) {
        this.safeSetItem(key, JSON.stringify([]));
      }
    });
  }

  private getTableKey(tableName: string): string {
    return `${this.prefix}${tableName}`;
  }

  private safeSetItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          throw new StorageError('localStorage quota exceeded. Please free up some space.');
        }
        throw new StorageError('Failed to write to localStorage: ' + error.message);
      }
      throw new StorageError('Failed to write to localStorage');
    }
  }

  private safeGetItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new StorageError('Failed to read from localStorage: ' + error.message);
      }
      throw new StorageError('Failed to read from localStorage');
    }
  }

  private safeParse<T>(data: string | null): T {
    if (!data) return [] as unknown as T;
    try {
      return JSON.parse(data) as T;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new StorageError('Failed to parse data from localStorage: ' + error.message);
      }
      throw new StorageError('Failed to parse data from localStorage');
    }
  }

  public subscribe(tableName: string, subscriber: Subscriber): () => void {
    if (!this.subscribers.has(tableName)) {
      this.subscribers.set(tableName, new Set());
    }
    this.subscribers.get(tableName)!.add(subscriber);

    return () => {
      const tableSubscribers = this.subscribers.get(tableName);
      if (tableSubscribers) {
        tableSubscribers.delete(subscriber);
      }
    };
  }

  private notify(event: StorageEvent): void {
    const tableSubscribers = this.subscribers.get(event.tableName);
    if (tableSubscribers) {
      tableSubscribers.forEach(subscriber => subscriber(event));
    }
  }

  public getAll<T extends Document>(tableName: string): T[] {
    const key = this.getTableKey(tableName);
    const data = this.safeGetItem(key);
    return this.safeParse<T[]>(data);
  }

  public getById<T extends Document>(tableName: string, id: string): T | null {
    const documents = this.getAll<T>(tableName);
    return documents.find(doc => doc._id === id) || null;
  }

  public query<T extends Document>(tableName: string, options: QueryOptions = {}): T[] {
    let documents = this.getAll<T>(tableName);

    if (options.conditions) {
      documents = this.filterDocuments(documents, options.conditions);
    }

    if (options.sort) {
      documents = this.sortDocuments(documents, options.sort);
    }

    if (options.skip) {
      documents = documents.slice(options.skip);
    }
    if (options.limit) {
      documents = documents.slice(0, options.limit);
    }

    return documents;
  }

  public insert<T extends Document>(tableName: string, document: Omit<T, '_id' | '_createdAt' | '_updatedAt'>): T {
    const documents = this.getAll<T>(tableName);
    const now = Date.now();
    
    const newDocument = {
      ...document,
      _id: crypto.randomUUID(),
      _createdAt: now,
      _updatedAt: now,
    } as T;

    documents.push(newDocument);
    this.safeSetItem(this.getTableKey(tableName), JSON.stringify(documents));

    this.notify({
      type: 'create',
      tableName,
      document: newDocument,
    });

    return newDocument;
  }

  public update<T extends Document>(tableName: string, id: string, update: Partial<T>): T {
    const documents = this.getAll<T>(tableName);
    const index = documents.findIndex(doc => doc._id === id);
    
    if (index === -1) {
      throw new StorageError(`Document with ID ${id} not found in table ${tableName}`);
    }

    const updatedDocument = {
      ...documents[index],
      ...update,
      _updatedAt: Date.now(),
    };

    documents[index] = updatedDocument;
    this.safeSetItem(this.getTableKey(tableName), JSON.stringify(documents));

    this.notify({
      type: 'update',
      tableName,
      document: updatedDocument,
    });

    return updatedDocument;
  }

  public delete(tableName: string, id: string): void {
    const documents = this.getAll(tableName);
    const index = documents.findIndex(doc => doc._id === id);
    
    if (index === -1) {
      throw new StorageError(`Document with ID ${id} not found in table ${tableName}`);
    }

    const deletedDocument = documents[index];
    documents.splice(index, 1);
    this.safeSetItem(this.getTableKey(tableName), JSON.stringify(documents));

    this.notify({
      type: 'delete',
      tableName,
      document: deletedDocument,
    });
  }

  public clear(tableName: string): void {
    this.safeSetItem(this.getTableKey(tableName), JSON.stringify([]));
  }

  private filterDocuments<T extends Document>(documents: T[], conditions: QueryCondition[]): T[] {
    return documents.filter(doc => {
      return conditions.every(condition => {
        const value = doc[condition.field];
        
        switch (condition.operator) {
          case 'eq':
            return value === condition.value;
          case 'neq':
            return value !== condition.value;
          case 'gt':
            return typeof value === 'number' && typeof condition.value === 'number' && value > condition.value;
          case 'gte':
            return typeof value === 'number' && typeof condition.value === 'number' && value >= condition.value;
          case 'lt':
            return typeof value === 'number' && typeof condition.value === 'number' && value < condition.value;
          case 'lte':
            return typeof value === 'number' && typeof condition.value === 'number' && value <= condition.value;
          case 'in':
            return Array.isArray(condition.value) && condition.value.includes(value);
          case 'nin':
            return Array.isArray(condition.value) && !condition.value.includes(value);
          case 'exists':
            return condition.value ? value !== undefined : value === undefined;
          case 'like':
            return typeof value === 'string' && 
                   typeof condition.value === 'string' && 
                   value.toLowerCase().includes(condition.value.toLowerCase());
          default:
            return true;
        }
      });
    });
  }

  private sortDocuments<T extends Document>(documents: T[], sort: { field: keyof T; order: 'asc' | 'desc' }[]): T[] {
    return [...documents].sort((a, b) => {
      for (const { field, order } of sort) {
        const aValue = a[field];
        const bValue = b[field];
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}