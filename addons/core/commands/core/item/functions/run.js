import onetype from '#framework/load.js';
import commands from '#commands/core/addon.js';

commands.Fn('item.run', function(item, properties = {}, onChunk = null, context = {})
{
    const startTime = performance.now();

    return new Promise(async (resolve, reject) =>
    {
        if(!item.Get('in'))
        {
            properties = {};
        }

        const emit = (result) =>
        {
            onetype.Emit('@commands.run', {
                id: item.Get('id'),
                input: properties,
                data: result.data,
                message: result.message,
                code: result.code,
                time: result.time
            });
        };

        const callback = (data, message = "Command '{{command}}' executed successfully.", code = 200, end = true) =>
        {
            if(message === null && code === 404)
            {
                message = 'The requested resource cannot be found.';
            }

            if(code >= 200 && code < 300 && item.Get('out'))
            {
                try
                {
                    data = onetype.DataDefine(data, onetype.DataConfig(item.Get('out')), true);
                }
                catch(error)
                {
                    throw onetype.Error(500, 'Command :command: OUT error: :reason:', {command: item.Get('id'), reason: error.message});
                }
            }

            const result = {
                data,
                message: message?.replace('{{command}}', item.Get('id')),
                code,
                time: (performance.now() - startTime).toFixed(2),
                end
            };

            if(onChunk && !result.end)
            {
                onChunk(result);
            }

            if(result.end)
            {
                emit(result);
                resolve(result);
            }
        };
     
        try
        {
            if(item.Get('in'))
            {
                try
                {
                    properties = onetype.DataDefine(properties, onetype.DataConfig(item.Get('in')), true);
                }
                catch(error)
                {
                    const result = {
                        data: error.message,
                        message: 'Command ' + item.Get('id') + ' invalid input: ' + error.message,
                        code: 400,
                        time: (performance.now() - startTime).toFixed(2),
                        end: true
                    };

                    emit(result);

                    return resolve(result);
                }
            }

            await item.Get('callback').call(context, properties, callback);
        }
        catch(error)
        {
            emit({
                data: null,
                message: error.message || String(error),
                code: 500,
                time: (performance.now() - startTime).toFixed(2)
            });

            reject(error);
        }
    })
});