import { TableSchema, FieldDefinition, ValidationError } from './types';

export class Validator {
  constructor(private schema: TableSchema) {}

  public getSchema(): TableSchema {
    return this.schema;
  }

  public validate(data: Record<string, unknown>): void {
    Object.entries(this.schema).forEach(([field, definition]) => {
      if (definition.required && data[field] === undefined) {
        throw new ValidationError(`Field '${field}' is required`);
      }
    });

    Object.entries(data).forEach(([field, value]) => {
      const fieldDef = this.schema[field];
      if (fieldDef) {
        this.validateField(field, value, fieldDef);
      }
    });
  }

  private validateField(field: string, value: unknown, definition: FieldDefinition): void {
    if (value === null && definition.type !== 'null') {
      throw new ValidationError(`Field '${field}' cannot be null`);
    }

    if (value === undefined) {
      if (definition.default !== undefined) {
        value = definition.default;
      }
      return;
    }

    switch (definition.type) {
      case 'string':
        if (typeof value !== 'string') {
          throw new ValidationError(`Field '${field}' must be a string`);
        }
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          throw new ValidationError(`Field '${field}' must be a number`);
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new ValidationError(`Field '${field}' must be a boolean`);
        }
        break;

      case 'date':
        if (!(value instanceof Date) && typeof value !== 'number') {
          throw new ValidationError(`Field '${field}' must be a Date or timestamp`);
        }
        break;

      case 'object':
        if (typeof value !== 'object' || Array.isArray(value) || value === null) {
          throw new ValidationError(`Field '${field}' must be an object`);
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          throw new ValidationError(`Field '${field}' must be an array`);
        }
        break;

      case 'null':
        if (value !== null) {
          throw new ValidationError(`Field '${field}' must be null`);
        }
        break;

      default:
        throw new ValidationError(`Unknown type '${definition.type}' for field '${field}'`);
    }
  }

  public applyDefaults(data: Record<string, unknown>): Record<string, unknown> {
    const result = { ...data };

    Object.entries(this.schema).forEach(([field, definition]) => {
      if (result[field] === undefined && definition.default !== undefined) {
        result[field] = definition.default;
      }
    });

    return result;
  }
} 