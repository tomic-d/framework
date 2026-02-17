import divhunt from '#divhunt';
import schedules from '../addon.js';

divhunt.AddonReady('commands', (commands) =>
{
    commands.Item({
        id: 'schedules:create',
        method: 'POST',
        endpoint: '/api/schedules',
        exposed: true,
        description: 'Create a new schedule',
        in: {
            id: ['string', null],
            name: ['string', null],
            group: ['string', null],
            description: ['string', null],
            type: ['string', 'once'],
            time: ['string|number', null, true],
            command: ['string|object', null],
            enabled: ['boolean', true],
            repeat: ['number', null],
            timezone: ['string', null]
        },
        out: {
            schedule: ['object']
        },
        callback: async function(props)
        {
            const id = props.id || divhunt.GenerateTID();

            if(schedules.ItemGet(id))
            {
                throw new Error(`Schedule "${id}" already exists.`);
            }

            const item = schedules.Item({
                id,
                name: props.name,
                group: props.group,
                description: props.description,
                type: props.type,
                time: props.time,
                command: props.command,
                enabled: props.enabled,
                repeat: props.repeat,
                timezone: props.timezone,
                runs: 0,
                last: null,
                next: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

            await item.Create();

            if(props.enabled)
            {
                schedules.Fn('start', id);
            }

            return {
                schedule: {
                    id: item.Get('id'),
                    name: item.Get('name'),
                    group: item.Get('group'),
                    description: item.Get('description'),
                    type: item.Get('type'),
                    time: item.Get('time'),
                    command: item.Get('command'),
                    enabled: item.Get('enabled'),
                    repeat: item.Get('repeat'),
                    timezone: item.Get('timezone'),
                    runs: item.Get('runs'),
                    last: item.Get('last'),
                    next: item.Get('next'),
                    created_at: item.Get('created_at'),
                    updated_at: item.Get('updated_at')
                }
            };
        }
    });
});
