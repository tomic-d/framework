import divhunt from '#divhunt';
import schedules from '../addon.js';

divhunt.AddonReady('commands', (commands) =>
{
    commands.Item({
        id: 'schedules:update',
        method: 'PUT',
        endpoint: '/api/schedules/:id',
        exposed: true,
        description: 'Update a schedule',
        in: {
            id: ['string', null, true],
            name: ['string', null],
            group: ['string', null],
            description: ['string', null],
            type: ['string', null],
            time: ['string|number', null],
            command: ['string|object', null],
            enabled: ['boolean', null],
            repeat: ['number', null],
            timezone: ['string', null]
        },
        out: {
            schedule: ['object']
        },
        callback: async function(props)
        {
            const item = schedules.ItemGet(props.id);

            if(!item)
            {
                throw new Error(`Schedule "${props.id}" not found.`);
            }

            const wasEnabled = item.Get('enabled');

            schedules.Fn('stop', props.id);

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

            if(props.type !== null && props.type !== undefined)
            {
                item.Set('type', props.type);
            }

            if(props.time !== null && props.time !== undefined)
            {
                item.Set('time', props.time);
            }

            if(props.command !== null && props.command !== undefined)
            {
                item.Set('command', props.command);
            }

            if(props.enabled !== null && props.enabled !== undefined)
            {
                item.Set('enabled', props.enabled);
            }

            if(props.repeat !== null && props.repeat !== undefined)
            {
                item.Set('repeat', props.repeat);
            }

            if(props.timezone !== null && props.timezone !== undefined)
            {
                item.Set('timezone', props.timezone);
            }

            item.Set('updated_at', new Date().toISOString());

            await item.Update();

            if(item.Get('enabled'))
            {
                schedules.Fn('start', props.id);
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
