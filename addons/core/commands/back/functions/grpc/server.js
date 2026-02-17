// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import commands from '../../addon.js';

commands.Fn('grpc.server', async function(port = 50000, callbacks = {})
{
    const grpcServers = (await import('#servers/grpc/load.js')).default;
    const server = grpcServers.Item({
        port: port,
        onStart: function()
        {
            callbacks['onStart'] && callbacks['onStart']();
        },
        onStreamConnect: (stream) => 
        {
            callbacks['onStreamConnect'] && callbacks['onStreamConnect'](stream);
        },
        onStreamData: async (stream, payload) => 
        {
            callbacks['onStreamData'] && callbacks['onStreamData'](stream, payload);

            if(payload.type !== 'request')
            {
                return;
            }

            const command = commands.ItemGet(payload.name);

            try
            {
                if(!command)
                {
                    throw new Error('Command does not exist.');
                }

                if(!command.Get('exposed'))
                {
                    throw new Error('Command is not exposed.');
                }

                const result = await command.Fn('run', payload.data, (chunk) =>
                {
                    callbacks['onStreamChunk'] && callbacks['onStreamChunk'](stream, chunk);
                    stream.respond(chunk.data, chunk.message, chunk.code, chunk.end, payload.id);
                });

                callbacks['onStreamRespond'] && callbacks['onStreamRespond'](stream, result);
                stream.respond(result.data, result.message, result.code, result.end, payload.id);
            }
            catch(error)
            {
                callbacks['onStreamRespond'] && callbacks['onStreamRespond'](stream, { data: null, message: error.message, code: 500 });
                return stream.respond(null, error.message, 500, true, payload.id);
            }
        },
        onError: (message) => 
        {
            callbacks['onError'] && callbacks['onError'](message);
        },
        onStreamError: function(stream)
        {
            callbacks['onStreamError'] && callbacks['onStreamError'](stream);
        },
        onStreamEnd: function(stream)
        {
            callbacks['onStreamEnd'] && callbacks['onStreamEnd'](stream);
        }
    });
    
    return server;
});