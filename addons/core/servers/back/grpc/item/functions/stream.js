// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import divhunt from '#framework/load.js';
import serversGRPC from '#servers/grpc/addon.js';

serversGRPC.Fn('item.stream', function(item, stream)
{
    stream.id = divhunt.GenerateUID();

    stream.request = function(name, data, onChunk = null, id = null)
    {
        id = id || divhunt.GenerateUID();

        const extracted = divhunt.BinariesExtract(data);

        stream.write({
            data: JSON.stringify({type: 'request', name, data: extracted.data, id}),
            binaries: extracted.binaries
        });

        item.Get('onStreamRequest') && item.Get('onStreamRequest').call(item, stream, {type: 'request', name, data, binaries: extracted.binaries, id});

        return item.Fn('resolve', id, null, onChunk);
    };

    stream.respond = function(data, message, code, end = true, id = null)
    {
        id = id || divhunt.GenerateUID();

        const extracted = divhunt.BinariesExtract(data);

        stream.write({
            data: JSON.stringify({type: 'respond', data: extracted.data, message, code, id, end}),
            binaries: extracted.binaries
        });

        item.Get('onStreamRespond') && item.Get('onStreamRespond').call(item, stream, {type: 'respond', data, binaries: extracted.binaries, message, code, end, id});
    };

    stream.on('data', (response) =>
    {
        const payload = JSON.parse(response.data);

        if(payload.data && response.binaries)
        {
            payload.data = divhunt.BinariesInject(payload.data, response.binaries);
        }

        if(payload.type === 'respond')
        {
            item.Fn('resolve', payload.id, payload);
        }

        item.Get('onStreamData') && item.Get('onStreamData').call(item, stream, payload);
    });

    stream.on('error', (error) => 
    {
        item.Get('onStreamError') && item.Get('onStreamError').call(item, stream, error.message);
    });

    stream.on('close', () => 
    {
        item.Get('onStreamEnd') && item.Get('onStreamEnd').call(item, stream);
    });

    item.Get('onStreamConnect') && item.Get('onStreamConnect').call(item, stream);
});