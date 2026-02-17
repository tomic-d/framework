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
            raw: response,
            streaming: false,
            types: this.methods.types,
            prevent: false,
            response: {
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

        const type = http.types[http.response.type] || http.types.JSON;

        http.time = (performance.now() - http.time).toFixed(2);

        if(http.error)
        {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({
                data: {},
                message: http.error,
                code: 500,
                time: http.time
            }));
            
            return;
        }

        const content = http.response.type === 'JSON' ? {
            data: http.response.data || {},
            message: http.response.message || 'No response message provided.',
            code: http.response.code,
            time: http.time
        } : http.response.data || '';

        response.writeHead(http.response.code, { 'Content-Type': type.contentType });
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
                http.error = error.message || 'Internal server error';

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
