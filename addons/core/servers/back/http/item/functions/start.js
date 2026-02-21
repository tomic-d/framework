import http from 'http';
import serversHTTP from '#servers/http/addon.js';
import divhunt from '#framework/load.js';

serversHTTP.Fn('item.start', function(item)
{
    if(item.Get('instance'))
    {
        item.Get('onError') && item.Get('onError')('HTTP Server already started.');
        return;
    }

    this.methods.types = {
        JSON: { contentType: 'application/json', formatter: content => JSON.stringify(content) },
        HTML: { contentType: 'text/html', formatter: content => String(content) },
        CSS:  { contentType: 'text/css', formatter: content => String(content) },
        JS:   { contentType: 'application/javascript', formatter: content => String(content) }
    };

    this.methods.createHttpObject = async (request, response) =>
    {
        return {
            id: divhunt.GenerateUID(),
            request,
            data: await serversHTTP.Fn('extract.data', request),
            url: new URL(request.url, `http://${request.headers.host}`),
            user: this.methods.user(request),
            time: performance.now(),
            error: null,
            response,
            streaming: false,
            types: this.methods.types,
            prevent: false,
            respond: {
                type: 'JSON',
                data: null,
                message: 'Request processed',
                code: 200
            }
        };
    };

    this.methods.user = (request) => 
    {
        const forwarded = request.headers['x-forwarded-for'];
        const agent = request.headers['user-agent'] || null;
        const referrer = request.headers['referer'] || null;

        const ip = (typeof forwarded === 'string' && forwarded.length) ? forwarded.split(',')[0].trim() : request.socket?.remoteAddress;

        return {
            ip,
            agent,
            forwarded: forwarded || null,
            referrer
        };

    };

    this.methods.respond = (http, response) =>
    {
        if(http.prevent)
        {
            return;
        }

        const type = http.types[http.respond.type] || http.types.JSON;

        http.time = (performance.now() - http.time).toFixed(2);

        if(http.error)
        {
            const code = http.errorCode || 500;

            response.writeHead(code, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({
                data: http.errorContext || {},
                message: http.error,
                code: code,
                time: http.time
            }));

            return;
        }

        const content = http.respond.type === 'JSON' ? {
            data: http.respond.data || {},
            message: http.respond.message || 'No response message provided.',
            code: http.respond.code,
            time: http.time
        } : http.respond.data || '';

        response.writeHead(http.respond.code, { 'Content-Type': type.contentType });
        response.end(type.formatter(content));

        item.Get('onComplete') && item.Get('onComplete')(http);
    };

    this.methods.init = () => 
    {
        const httpServer = http.createServer(async (request, response) =>
        {
            const http = await this.methods.createHttpObject(request, response);

            try
            {
                if(item.Get('onRequest'))
                {
                    await Promise.resolve(item.Get('onRequest')(http));
                }

                this.methods.respond(http, response);
            }
            catch(error)
            {
                const code = typeof error.code === 'number' ? error.code : 500;

                http.error = error.message || 'Internal server error';
                http.errorCode = code;
                http.errorContext = error.context || {};

                item.Get('onError') && item.Get('onError')(http.error);

                this.methods.respond(http, response);
            }
        });
        
        httpServer.on('error', (error) =>
        {
            item.Get('onError') && item.Get('onError')(error.message);
        });
        
        httpServer.listen(item.Get('port'), () =>
        {
            item.Set('instance', httpServer);
            item.Get('onStart') && item.Get('onStart')(httpServer);
        });
    };

    this.methods.init();
});
