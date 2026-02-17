import divhunt from '#divhunt';
import sources from '../addon.js';

divhunt.AddonReady('commands', (commands) =>
{
    commands.Item({
        id: 'sources:one',
        method: 'GET',
        endpoint: '/api/sources/:id',
        exposed: true,
        description: 'Get a single source by ID',
        in: {
            id: ['string', null, true]
        },
        out: {
            source: ['object']
        },
        callback: async function(props)
        {
            const item = sources.ItemGet(props.id);

            if(!item)
            {
                throw new Error(`Source "${props.id}" not found.`);
            }

            return {
                source: {
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
                }
            };
        }
    });
});
