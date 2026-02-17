# Database Service

A comprehensive database abstraction layer built on top of Knex.js providing a powerful query builder, CRUD operations, and relationship management for PostgreSQL databases.

## Features

- **Advanced Query Builder** - Fluent API for complex queries with filtering, sorting, pagination
- **CRUD Operations** - Create, read, update, delete with automatic timestamp management
- **Relationship Management** - One-to-one and one-to-many relationship handling
- **Transaction Support** - Database transaction wrapper for atomic operations
- **Validation** - Built-in field and parameter validation
- **Connection Management** - Automatic PostgreSQL connection pooling via Knex.js
- **Middleware Integration** - Seamless integration with framework middleware system

## Installation

```javascript
import database from '#database/load.js';
```

## Configuration

Create a database connection item:

```javascript
const dbConnection = database.ItemAdd({
    hostname: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'myapp'
});
```

## Framework Integration

The database service integrates seamlessly with the framework's middleware system. Each addon automatically gets `Find()` method, and each item gets `Create()`, `Update()`, `Delete()` methods that call middleware interceptors.

### Addon Methods

```javascript
// Every addon has a Find() method
const users = await userAddon.Find()
    .filter('status', 'active')
    .many();
```

### Item Methods

```javascript
// Every item has CRUD methods
await userItem.Create('primary');    // Creates new record
await userItem.Update('primary');    // Updates existing record  
await userItem.Delete('primary');    // Deletes record
```

These methods work by calling middleware interceptors:

```javascript
// How item methods work internally
const AddonItemCrud = {
    async Create(connection = 'primary') {
        const value = {item: this, table: this.addon.TableGet(), response: null, connection};
        await this.addon.divhunt.Middleware('item.crud.create', value);
        return value.response;
    },

    async Update(connection = 'primary') {
        const value = {item: this, table: this.addon.TableGet(), response: null, connection};
        await this.addon.divhunt.Middleware('item.crud.update', value);
        return value.response;
    },

    async Delete(connection = 'primary') {
        const value = {item: this, table: this.addon.TableGet(), response: null, connection};
        await this.addon.divhunt.Middleware('item.crud.delete', value);
        return value.response;
    }
};
```

The database service intercepts these middleware calls:
- `item.crud.create` → `database.Fn('create')`
- `item.crud.update` → `database.Fn('update')`  
- `item.crud.delete` → `database.Fn('delete')`
- `addon.items.find` → `database.Fn('find')`

## Basic Usage

### Finding Records

```javascript
// Simple find
const users = await database.Fn('find', connection, table, addon)
    .filter('status', 'active')
    .many();

// Complex filtering
const results = await database.Fn('find', connection, table, addon)
    .filter('age', 18, 'GREATER EQUALS')
    .filter('name', 'John%', 'LIKE')
    .sort('created_at', 'desc')
    .limit(10)
    .page(2)
    .many();

// Grouped conditions
const users = await database.Fn('find', connection, table, addon)
    .group('OR')
        .filter('status', 'premium')
        .filter('trial_expires', new Date(), 'GREATER')
    .end()
    .filter('active', true)
    .many();
```

### CRUD Operations

```javascript
// Framework integration - automatic methods on items
await userItem.Create('primary');
await userItem.Update('primary');  
await userItem.Delete('primary');

// Direct database service usage
await database.Fn('create', connection, table, item);
await database.Fn('update', connection, table, item);
await database.Fn('delete', connection, table, item);

// Item-level functions (bypassing middleware)
await item.save();
await item.create(addon);
await item.update();
await item.delete();
```

### Framework vs Direct Usage

```javascript
// Framework way (goes through middleware)
const user = userAddon.ItemAdd({name: 'John', email: 'john@example.com'});
await user.Create('primary');

// Direct way (bypasses middleware)  
const user = userAddon.ItemAdd({name: 'John', email: 'john@example.com'});
await user.save();

// Both achieve the same result, framework way allows middleware interception
```

### Item-Level Operations

```javascript
// Direct item operations
await item.create(addon);
await item.update();
await item.delete();
await item.save();

// Find related items
const user = await item.relation('user_id', userAddon);
const comments = await item.relations('post_id', commentAddon);
```

## Query Methods

### Filters

| Operator | Description | Example |
|----------|-------------|---------|
| `EQUALS` | Exact match (default) | `.filter('status', 'active')` |
| `NOT EQUALS` | Not equal | `.filter('status', 'inactive', 'NOT EQUALS')` |
| `GREATER` | Greater than | `.filter('age', 18, 'GREATER')` |
| `LESS` | Less than | `.filter('price', 100, 'LESS')` |
| `LIKE` | Pattern matching | `.filter('name', 'John%', 'LIKE')` |
| `IN` | Value in list | `.filter('status', ['active', 'pending'], 'IN')` |
| `BETWEEN` | Between values | `.filter('age', [18, 65], 'BETWEEN')` |
| `NULL` | Is null | `.filter('deleted_at', null, 'NULL')` |

### Query Builder Methods

```javascript
const query = database.Fn('find', connection, table, addon);

// Filtering
query.filter(field, value, operator)
query.orFilter(field, value, operator)

// Grouping
query.group('AND|OR')
    .filter(...)
    .filter(...)
.end()

// Sorting & Pagination
query.sort(field, 'asc|desc')
query.limit(count)
query.page(number)

// Selection
query.select(['field1', 'field2'])
query.distinct()

// Execution
await query.many()      // Get multiple records
await query.one()       // Get single record
await query.count()     // Get count
await query.exists()    // Check if exists
```

## Transactions

```javascript
await item.transaction(async (trx) => {
    await database.Fn('create', trx, table1, item1);
    await database.Fn('update', trx, table2, item2);
    // Auto-commit on success, auto-rollback on error
});
```

## Relationships

```javascript
// One-to-one relationship
const user = await post.relation('user_id', userAddon);

// One-to-many relationship  
const comments = await post.relations('post_id', commentAddon);
```

## Validation

The service includes automatic validation for:
- Field names (alphanumeric + underscore + dot, max 64 chars)
- Operators (must be from supported list)
- Values (string, number, boolean, or null)
- Pagination parameters (positive integers)
- Sort directions ('asc' or 'desc')

## Error Handling

All operations include comprehensive error handling with descriptive messages:

```javascript
try {
    const results = await query.filter('invalid-field!', 'value').many();
} catch (error) {
    // Error: Invalid field name format: 'invalid-field!'...
}
```

## Architecture

The service uses a layered architecture:

1. **Item Functions** - Core database operations
2. **Main Functions** - Thin wrappers calling item functions  
3. **Middleware** - Framework integration layer
4. **Query Builder** - Fluent API for complex queries

This design ensures code reuse and maintains consistency across all access patterns.

## Connection Management

Connections are automatically managed with:
- Connection pooling (0-25 connections)
- 1-second timeouts for acquisition and idle
- Automatic cleanup and error handling

## Data Schemas

The service defines validation schemas for:
- `filter` - Query filter structure
- `query` - Complete query parameters

These ensure type safety and parameter validation throughout the system.