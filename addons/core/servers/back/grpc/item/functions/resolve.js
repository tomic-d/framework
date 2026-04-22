import serversGRPC from '#servers/grpc/addon.js';

const promises = {};

serversGRPC.Fn('item.resolve', function(item, id, payload = null, onChunk = null, timeoutMs = 60000)
{
    if(payload === null)
    {
        const timeout = setTimeout(() =>
        {
            promises[id].resolve({data: null, message: 'Request timed out after ' + timeoutMs + 'ms. No response received.', code: 408, id, time: timeoutMs});
            delete(promises[id]);
        }, timeoutMs);

        return new Promise((resolve) =>
        {
            promises[id] = { resolve, timeout, onChunk, time: performance.now() };
        });
    }

    if(!promises[id])
    {
        return;
    }

    if(promises[id].onChunk && !payload.end)
    {
        promises[id].onChunk(payload);
    }

    if(payload.end)
    {
        payload.time = (performance.now() - promises[id].time).toFixed(2);
        promises[id].resolve(payload);
        clearTimeout(promises[id].timeout);

        delete promises[id];
    }
});