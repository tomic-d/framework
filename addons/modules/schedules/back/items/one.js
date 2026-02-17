import divhunt from '#divhunt';
import schedules from '../addon.js';

divhunt.AddonReady('commands', (commands) =>
{
    commands.Item({
        id: 'schedules:one',
        method: 'GET',
        endpoint: '/api/schedules/:id',
        exposed: true,
        description: 'Get a single schedule by ID',
        in: {
            id: ['string', null, true]
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
