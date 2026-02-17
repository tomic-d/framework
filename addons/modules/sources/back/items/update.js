import divhunt from '#divhunt';
import sources from '../addon.js';

divhunt.AddonReady('commands', (commands) =>
{
    commands.Item({
        id: 'sources:update',
        method: 'PUT',
        endpoint: '/api/sources/:id',
        exposed: true,
        description: 'Update a source',
        in: {
            id: ['string', null, true],
            name: ['string', null],
            group: ['string', null],
            description: ['string', null],
            command: ['string|object', null],
            endpoint: ['string', null],
            method: ['string', null],
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
            const item = sources.ItemGet(props.id);

            if(!item)
            {
                throw new Error(`Source "${props.id}" not found.`);
            }

            if(props.name !== null && props.name !== undefined)
            {
                item.Set('name', props.name);
            }

            if(props.group !== null && props.group !== undefined)
            {
                item.Set('group', props.group);
            }

            if(props.description !== null && props.description !== undefined)
            {
                item.Set('description', props.description);
            }

            if(props.command !== null && props.command !== undefined)
            {
                item.Set('command', props.command);
            }

            if(props.endpoint !== null && props.endpoint !== undefined)
            {
                item.Set('endpoint', props.endpoint);
            }

            if(props.method !== null && props.method !== undefined)
            {
                item.Set('method', props.method);
            }

            if(props.headers !== null && props.headers !== undefined)
            {
                item.Set('headers', props.headers);
            }

            if(props.body !== null && props.body !== undefined)
            {
                item.Set('body', props.body);
            }

            if(props.in !== null && props.in !== undefined)
            {
                item.Set('in', props.in);
            }

            if(props.out !== null && props.out !== undefined)
            {
                item.Set('out', props.out);
            }

            item.Set('updated_at', new Date().toISOString());

            await item.Update();

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
