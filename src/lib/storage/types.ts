export type FieldType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'object'
  | 'array'
  | 'null';

export interface FieldDefinition {
  type: FieldType;
  required?: boolean;
  default?: unknown;
  index?: boolean;
}

export interface TableSchema {
  [key: string]: FieldDefinition;
}

export interface DatabaseSchema {
  [tableName: string]: TableSchema;
}

export interface Document {
  _id: string;
  _createdAt: number;
  _updatedAt: number;
  [key: string]: unknown;
}

export type QueryOperator = 
  | 'eq'      // equals
  | 'neq'     // not equals
  | 'gt'      // greater than
  | 'gte'     // greater than or equal
  | 'lt'      // less than
  | 'lte'     // less than or equal
  | 'in'      // in array
  | 'nin'     // not in array
  | 'exists'  // field exists
  | 'like';   // string contains (case insensitive)

export interface QueryCondition {
  field: string;
  operator: QueryOperator;
  value: unknown;
}

export type SortOrder = 'asc' | 'desc';

export interface SortSpec {
  field: string;
  order: SortOrder;
}

export interface QueryOptions {
  conditions?: QueryCondition[];
  sort?: SortSpec[];
  limit?: number;
  skip?: number;
}

export type EventType = 'create' | 'update' | 'delete';

export interface StorageEvent<T extends Document = Document> {
  type: EventType;
  tableName: string;
  document: T;
}

export type Subscriber = (event: StorageEvent) => void;

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class ValidationError extends StorageError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends StorageError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
} 