import divhunt from '#divhunt';
import sources from '../addon.js';

divhunt.AddonReady('commands', (commands) =>
{
    commands.Item({
        id: 'sources:create',
        method: 'POST',
        endpoint: '/api/sources',
        exposed: true,
        description: 'Create a new source',
        in: {
            id: ['string', null],
            name: ['string', null],
            group: ['string', null],
            description: ['string', null],
            command: ['string|object', null],
            endpoint: ['string', null],
            method: ['string', 'GET'],
            headers: ['object', null],
            body: ['object|string', null],
            in: ['object', null],
            out: ['object', null]
        },
        out: {
            source: ['object']
        },
        callback: async function(props)
        {
            const id = props.id || divhunt.GenerateTID();

            if(sources.ItemGet(id))
            {
                throw new Error(`Source "${id}" already exists.`);
            }

            const item = sources.Item({
                id,
                name: props.name,
                group: props.group,
                description: props.description,
                command: props.command,
                endpoint: props.endpoint,
                method: props.method,
                headers: props.headers,
                body: props.body,
                in: props.in,
                out: props.out,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

            await item.Create();

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
