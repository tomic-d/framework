import divhunt from '#framework/load.js';
import commands from '#commands/core/addon.js';

commands.Fn('http.server', async function(port = 3000, callbacks = {})
{
    const serversHTTP = (await import('#servers/http/load.js')).default;

    return serversHTTP.Item({
        port,
        onStart: (server) =>
        {
            callbacks['onStart'] && callbacks['onStart'](server);
        },
        onRequest: async (http) =>
        {
            const onRequestResult = callbacks['onRequest'] && await callbacks['onRequest'](http);

            if(onRequestResult === false || http.prevent)
            {
                callbacks['onResponse'] && callbacks['onResponse'](http);
                return;
            }

            const command = commands.Fn('find', http.request.method, http.url.pathname);

            if(!command || !command.Get('exposed'))
            {
                http.respond.code = 404;
                http.respond.message = 'Command not found.';

                callbacks['onResponse'] && callbacks['onResponse'](http);
                return;
            }

            // Extract path parameters from URL
            const endpoint = command.Get('endpoint');
            const params = divhunt.RouteParams(endpoint, decodeURIComponent(http.url.pathname));

            if (params)
            {
                Object.assign(http.data, params);
            }

            const type = http.types[command.Get('type')] || http.types.JSON;

            if(http.data.streaming)
            {
                http.data.streaming = 1;
                http.prevent = true;
                http.response.writeHead(200, {
                    'Content-Type': type.contentType,
                    'Transfer-Encoding': 'chunked'
                });
            }

            const response = await command.Fn('run', http.data, (chunk) =>
            {
                if(http.data.streaming)
                {
                    http.data.streaming++;
                    http.response.write(type.formatter(chunk.data) + '\n');
                }

                callbacks['onChunk'] && callbacks['onChunk'](http, chunk);
            }, {http});

            if(http.data.streaming)
            {
                if(http.data.streaming === 1)
                {
                    http.response.write(type.formatter(response.data) + '\n');
                }

                http.response.end();
            }

            http.respond.type = command.Get('type');
            http.respond.data = response.data;
            http.respond.message = response.message;
            http.respond.code = response.code;

            callbacks['onResponse'] && callbacks['onResponse'](http);
        },
        onError: (error) =>
        {
            callbacks['onError'] && callbacks['onError'](error);
        }
    });
});
