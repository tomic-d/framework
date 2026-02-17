# Servers

HTTP and gRPC servers, both configured through the commands addon.

## HTTP server

```js
import commands from '#commands/load.js';

commands.Fn('http.server', 3000, {
    onStart: (server) => {
        console.log('HTTP server started on port 3000');
    },
    onResponse: (http) => {
        // Called after each response
    },
    onError: (error) => {
        console.log('HTTP server error:', error.message);
    }
});
```

## gRPC server

Bidirectional streaming with automatic reconnection and binary data transport.

```js
commands.Fn('grpc.server', 50000, {
    onStart: function() {
        console.log('gRPC server started on port 50000');
    },
    onStreamConnect: async function(stream) {
        // Authenticate via metadata
        const node = await nodes.Fn('find', stream.metadata.get('token')[0]);

        // Track the connection as an item
        const connection = streams.Item({
            gateway_id: gateway.Get('id'),
            node_id: node.Get('id')
        });
        await connection.Create();

        // Attach runtime state via Store
        connection.StoreSet('gateway', gateway);
        connection.StoreSet('node', node);
        connection.StoreSet('stream', stream);

        stream.connection = connection;

        console.log('Connection established:', node.Get('name'));
    },
    onStreamEnd: function(stream) {
        if (stream.connection) {
            const node = stream.connection.StoreGet('node');
            console.log('Disconnected:', node.Get('name'));

            stream.connection.Delete();
            stream.connection.Remove();
        }
    },
    onStreamError: function(stream) {
        console.log('Stream error');
    },
    onError: function(message) {
        console.log('Server error:', message);
    }
});
```

## Binary transport

gRPC messages are JSON strings. Binary data (Buffers) is automatically extracted into a separate `map<string, bytes>` field before sending and re-injected on receive.

```js
// Extract binaries from a data object
const extracted = divhunt.BinariesExtract(data);
// extracted.data    → JSON-safe object (Buffers replaced with keys)
// extracted.binaries → map of key → Buffer

// Re-inject binaries
const restored = divhunt.BinariesInject(extracted.data, extracted.binaries);
```

This enables transparent file transfers over the same gRPC stream without base64 encoding.

## Store API

Per-item in-memory key-value storage — useful for attaching runtime state (like gRPC streams) to items:

```js
// Set
connection.StoreSet('node', nodeItem);
connection.StoreSet('stream', streamObject);

// Get
const node = connection.StoreGet('node');
const stream = connection.StoreGet('stream');
```

Store data is never persisted to the database. It exists only in memory for the lifetime of the item.

## Requesting over gRPC

Send a request to a connected node and await the response:

```js
const response = await stream.request('tool-slug', inputProperties, (chunk) => {
    // Optional: handle streaming chunks
    resolve(chunk.data, chunk.message, chunk.code, false);
});

// response.data, response.message, response.code, response.time
```

## Graceful shutdown

The framework handles process signals through middleware:

```js
process.on('SIGINT', async () => {
    await divhunt.Middleware('sigint');
    await divhunt.Middleware('shutdown');
    process.exit(0);
});
```

Register shutdown handlers:

```js
divhunt.MiddlewareAdd('shutdown', async () => {
    // Close connections, flush data, etc.
});
```
