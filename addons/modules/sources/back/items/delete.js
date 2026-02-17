import divhunt from '#divhunt';
import sources from '../addon.js';

divhunt.AddonReady('commands', (commands) =>
{
    commands.Item({
        id: 'sources:delete',
        method: 'DELETE',
        endpoint: '/api/sources/:id',
        exposed: true,
        description: 'Delete a source',
        in: {
            id: ['string', null, true]
        },
        out: {
            deleted: ['boolean']
        },
        callback: async function(props)
        {
            const item = sources.ItemGet(props.id);

            if(!item)
            {
                throw new Error(`Source "${props.id}" not found.`);
            }

            await item.Delete();

            sources.ItemRemove(props.id);

            return {
                deleted: true
            };
        }
    });
});
