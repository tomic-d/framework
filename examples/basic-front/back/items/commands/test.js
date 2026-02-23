import commands from 'onetype/commands';

commands.Item({
    id: 'test',
    exposed: true,
    method: 'POST',
    endpoint: '/api/test',
    type: 'JSON',
    in: {
        name: ['string', 'World']
    },
    out: {
        message: ['string']
    },
    callback: async function(properties, resolve)
    {
        resolve({ message: 'Hello, ' + properties.name + '!' });
    }
});
