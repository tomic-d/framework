import onetype from '#framework/load.js';
import commands from '#commands/core/addon.js';

commands.Item({
    id: 'commands:get:many',
    exposed: true,
    method: 'GET',
    type: 'JSON',
    out: {
        commands: {
            type: 'array',
            each: {
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
        }
    },
    callback: async function(properties, resolve)
    {
        const list = [];

        Object.values(commands.Items()).forEach((item) =>
        {
            if(!item.Get('exposed'))
            {
                return true;
            }

            list.push({
                id: item.Get('id'),
                exposed: item.Get('exposed'),
                meta: {
                    description: item.Get('description'),
                },
                data: {
                    in: (item.Get('in') ? onetype.DataConfig(item.Get('in')) : null),
                    out: (item.Get('out') ? onetype.DataConfig(item.Get('out')) : null)
                },
                api: {
                    type: item.Get('type'),
                    method: item.Get('method'),
                    endpoint: item.Get('endpoint')
                }
            });
        });

        resolve({commands: list});
    }
});
