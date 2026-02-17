import commands from '../../addon.js';

commands.Fn('grpc.client', async function(host, port, metadata = {}, prefix = 'remote', bidirectional = false, callbacks = {})
{
    const grpcClients = (await import('#clients/grpc/load.js')).default;
    const store = new Set();
    const retry = { tries: 0, retries: 20, delay: 15000, timeout: null };

    const connect = () =>
    {
        if(retry.timeout)
        {
            clearTimeout(retry.timeout);
            retry.timeout = null;
        }

        const client = grpcClients.Item(
        {
            host,
            port,
            metadata,
            onConnect: function(client)
            {
                retry.tries = 0;
                callbacks['onConnect'] && callbacks['onConnect'](client);
                this.Fn('stream');
            },

            onStream: async function(stream)
            {
                callbacks['onStream'] && callbacks['onStream'](stream);

                const result = await stream.request('commands:get:many');

                if(result.code !== 200)
                {
                    return stream.cancel();
                }

                const list = result.data.commands;

                list.forEach((command) =>
                {
                    const id = prefix + ':' + command.id;

                    commands.Item(
                    {
                        id,
                        in: command.data.in,
                        out: command.data.out,
                        callback: async (properties, resolve) =>
                        {
                            const result = await stream.request(command.id, properties, (chunk) =>
                            {
                                callbacks['onStreamChunk'] && callbacks['onStreamChunk'](stream, chunk);
                                resolve(chunk.data, chunk.message, chunk.code, chunk.end);
                            });

                            resolve(result.data, result.message, result.code, result.end);
                        }
                    });

                    store.add(id);
                });

                callbacks['onCommands'] && callbacks['onCommands'](stream, store);
            },

            onStreamData: async function(stream, payload)
            {
                if(!bidirectional)
                {
                    return stream.respond(null, 'Client does not support a bidirectional streaming.', 404, true, payload.id);
                }

                if(payload.type === 'request')
                {
                    try
                    {
                        const command = commands.ItemGet(payload.name);

                        if(!command)
                        {
                            throw new Error('Command does not exist.');
                        }

                        if(store.has(payload.name))
                        {
                            throw new Error('Cannot execute remote commands recursively.');
                        }

                        if(payload.name.startsWith(prefix + ':'))
                        {
                            throw new Error('Cannot execute ' + prefix + ' commands recursively.');
                        }

                        const result = await command.Fn('run', payload.data, (chunk) =>
                        {
                            callbacks['onStreamChunk'] && callbacks['onStreamChunk'](stream, chunk);
                            stream.respond(chunk.data, chunk.message, chunk.code, chunk.end, payload.id);
                        });

                        callbacks['onStreamRespond'] && callbacks['onStreamRespond'](stream, payload, result.data, result.message, result.code, payload.id);
                        stream.respond(result.data, result.message, result.code, result.end, payload.id);
                    }
                    catch(error)
                    {
                        callbacks['onStreamRespond'] && callbacks['onStreamRespond'](stream, payload, null, error.message, 500, payload.id);
                        stream.respond(null, error.message, 500, true, payload.id);
                    }
                }
            },

            onStreamEnd: function(stream)
            {
                callbacks['onStreamEnd'] && callbacks['onStreamEnd'](stream);

                store.forEach(id =>
                {
                    commands.ItemRemove(id);
                });
                
                store.clear();

                if(retry.tries < retry.retries)
                {
                    retry.tries++;
                    retry.timeout = setTimeout(() => connect(), retry.delay);
                }
            },

            onStreamError: function(stream, message)
            {
                callbacks['onStreamError'] && callbacks['onStreamError'](stream, message);
            },
            
            onError: function(message)
            {
                callbacks['onError'] && callbacks['onError'](message);

                if(retry.tries < retry.retries)
                {
                    client.Remove();

                    retry.tries++;
                    retry.timeout = setTimeout(() => connect(), retry.delay);
                }
            }
        });

        return client;
    };

    return connect();
});