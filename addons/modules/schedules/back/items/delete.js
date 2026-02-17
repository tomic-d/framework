import divhunt from '#divhunt';
import schedules from '../addon.js';

divhunt.AddonReady('commands', (commands) =>
{
    commands.Item({
        id: 'schedules:delete',
        method: 'DELETE',
        endpoint: '/api/schedules/:id',
        exposed: true,
        description: 'Delete a schedule',
        in: {
            id: ['string', null, true]
        },
        out: {
            deleted: ['boolean']
        },
        callback: async function(props)
        {
            const item = schedules.ItemGet(props.id);

            if(!item)
            {
                throw new Error(`Schedule "${props.id}" not found.`);
            }

            schedules.Fn('stop', props.id);

            await item.Delete();

            schedules.ItemRemove(props.id);

            return {
                deleted: true
            };
        }
    });
});
