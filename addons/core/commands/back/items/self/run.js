import commands from '#commands/core/addon.js';

commands.Item({
    id: 'commands:run',
    method: 'POST',
    type: 'JSON',
    in: {
        id: ['string', null, true],
        data: ['object']
    },
    out: {
        data: ['string|object|boolean|number|array'],
        message: ['string'],
        code: ['number']
    },
    callback: async function(properties, resolve)
    {
        const command = commands.ItemGet(properties.id);

        if(!command)
        {
            return resolve(null, 'Command does not exist.', 404);
        }

        if(!command.Get('exposed'))
        {
            return resolve(null, 'Command is not exposed.', 403);
        }

        try
        {
            const result = await commands.Item(properties.id).Fn('run', (properties.data || {}));

            resolve({
                data: result.data,
                message: result.message,
                code: result.code
            });
        }
        catch(error)
        {
            resolve(null, error.message, typeof error.code === 'number' ? error.code : 500);
        }
    }
});
