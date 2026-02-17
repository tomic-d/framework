import divhunt from '#divhunt';
import sources from '../addon.js';

divhunt.AddonReady('commands', (commands) =>
{
    commands.Item({
        id: 'sources:many',
        method: 'GET',
        endpoint: '/api/sources',
        exposed: true,
        description: 'Get all sources',
        in: {
            page: ['number', 1],
            limit: ['number', 50],
            group: ['string', null]
        },
        out: {
            sources: {
                type: 'array',
                each: {
                    type: 'object',
                    config: {
                        id: ['string'],
                        name: ['string'],
                        group: ['string'],
                        description: ['string'],
                        command: ['string|object'],
                        endpoint: ['string'],
                        method: ['string'],
                        headers: ['object'],
                        body: ['object|string'],
                        in: ['object'],
                        out: ['object'],
                        created_at: ['string'],
                        updated_at: ['string']
                    }
                }
            },
            total: ['number']
        },
        callback: async function(props)
        {
            const result = [];

            for(const id in sources.items.data)
            {
                const item = sources.items.data[id];

                if(props.group && item.Get('group') !== props.group)
                {
                    continue;
                }

                result.push({
                    id: item.Get('id'),
                    name: item.Get('name'),
                    group: item.Get('group'),
                    description: item.Get('description'),
                    command: item.Get('command'),
                    endpoint: item.Get('endpoint'),
                    method: item.Get('method'),
                    headers: item.Get('headers'),
                    body: item.Get('body'),
                    in: item.Get('in'),
                    out: item.Get('out'),
                    created_at: item.Get('created_at'),
                    updated_at: item.Get('updated_at')
                });
            }

            const start = (props.page - 1) * props.limit;
            const end = start + props.limit;

            return {
                sources: result.slice(start, end),
                total: result.length
            };
        }
    });
});
