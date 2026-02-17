import divhunt from '#divhunt';
import schedules from '../addon.js';

divhunt.AddonReady('commands', (commands) =>
{
    commands.Item({
        id: 'schedules:many',
        method: 'GET',
        endpoint: '/api/schedules',
        exposed: true,
        description: 'Get all schedules',
        in: {
            page: ['number', 1],
            limit: ['number', 50],
            group: ['string', null],
            enabled: ['boolean', null]
        },
        out: {
            schedules: {
                type: 'array',
                each: {
                    type: 'object',
                    config: {
                        id: ['string'],
                        name: ['string'],
                        group: ['string'],
                        description: ['string'],
                        type: ['string'],
                        time: ['string|number'],
                        command: ['string|object'],
                        enabled: ['boolean'],
                        repeat: ['number'],
                        timezone: ['string'],
                        runs: ['number'],
                        last: ['string'],
                        next: ['string'],
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

            for(const id in schedules.items.data)
            {
                const item = schedules.items.data[id];

                if(props.group && item.Get('group') !== props.group)
                {
                    continue;
                }

                if(props.enabled !== null && item.Get('enabled') !== props.enabled)
                {
                    continue;
                }

                result.push({
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
                });
            }

            const start = (props.page - 1) * props.limit;
            const end = start + props.limit;

            return {
                schedules: result.slice(start, end),
                total: result.length
            };
        }
    });
});
