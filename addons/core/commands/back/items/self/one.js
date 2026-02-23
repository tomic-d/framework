import onetype from '#framework/load.js';
import commands from '#commands/core/addon.js';

commands.Item({
    id: 'commands:get:one',
    method: 'GET',
    type: 'JSON',
    in: {
        id: ['string']
    },
    out: {
        command: {
            type: 'object',
            config: {
                id: ['string'],
                exposed: ['boolean'],
                meta: {
                    type: 'object',
                    config: {
                        description: ['string']
                    }
                },
                data: {
                    type: 'object',
                    config: {
                        in: ['object'],
                        out: ['object'],
                    }
                },
                api: {
                    type: 'object',
                    config: {
                        type: ['string'],
                        method: ['string'],
                        endpoint: ['string']
                    }
                }
            }
        }
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

        resolve({
            command: {
                id: command.Get('id'),
                exposed: command.Get('exposed'),
                meta: {
                    description: command.Get('description'),
                },
                data: {
                    in: command.Get('in') ? onetype.DataConfig(command.Get('in')) : null,
                    out: command.Get('out') ? onetype.DataConfig(command.Get('out')) : null
                },
                api: {
                    type: command.Get('type'),
                    method: command.Get('method'),
                    endpoint: command.Get('endpoint')
                }
            }
        });
    }
});
